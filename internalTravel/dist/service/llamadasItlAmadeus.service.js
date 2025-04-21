"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPassengers = exports.processAndAddPaxes = exports.finishBooking = exports.processFail = exports.processAndAddFlight = void 0;
const aea_logger_1 = require("aea-logger");
const gyms_external_1 = require("../externals/gyms.external");
const ITLamadeus_external_1 = require("../externals/ITLamadeus.external");
// main function in add flight process
const processAndAddFlight = async (itlBooking) => {
    let response;
    let amadeusSession;
    let allOkInBookingProcess = true;
    let contador = 0;
    for (const flight of itlBooking.flights || []) {
        console.log('flight', flight);
        flight.amadeusErrorCode = [];
        flight.gymsResponse = {};
        const resultado = await processFlight(flight, amadeusSession, contador);
        allOkInBookingProcess = resultado.allOkInBookingProcess;
        amadeusSession = resultado.amadeusSession;
        console.log('resultado', resultado);
        if (!allOkInBookingProcess) {
            return response = (0, exports.processFail)(itlBooking, amadeusSession);
        }
        contador++;
    }
    ;
    response = { itlBooking, amadeusSession, allOkInBookingProcess };
    return response;
};
exports.processAndAddFlight = processAndAddFlight;
// Variables Generales
const LEADING_ZERO = /^0+/;
const FREE_TEXT_AMA_ERROR = 'TICKET RECONCILIATION NEEDED';
const GYMS_CALL = 'S';
const FORCE_IS_POSSIBLE_YES = 'S';
const FORCE_IS_POSSIBLE_NO = 'N';
const DEFAULT_ERROR_CODE = 'N/A';
const DEFAULT_ERROR_CATEGORY = 'N/A';
const DEFAULT_ERROR_OWNER = 'N/A';
// Procesar cada flight individualmente
const processFlight = async (flight, amadeusSession, contador) => {
    let response;
    if (flight.llamadaGyms === GYMS_CALL) {
        // Verificamos si el campo forceIsPossible existe en la respuesta
        const bloqueo = await (0, gyms_external_1.getGyms)(flight) || { forceIsPossible: FORCE_IS_POSSIBLE_NO, gyms: {} };
        // Verificamos si el campo forceIsPossible existe, si no, lo creamos con valor 'N'
        if (bloqueo.gyms) {
            flight.gymsResponse = { gyms: "No se ha podido obtener la respuesta de Gyms" };
        }
        else {
            flight.gymsResponse = bloqueo;
        }
        if (bloqueo.forceIsPossible === FORCE_IS_POSSIBLE_YES) {
            const resultadoAmadeus = await llamarAmadeus(flight, amadeusSession, contador);
            if (!resultadoAmadeus.successCallToExternalServices) {
                response = await intentarConCodigoBloqueo(flight, resultadoAmadeus.amadeusSession, contador);
            }
            else {
                response = { ...resultadoAmadeus, flight };
            }
        }
        else {
            response = await intentarConCodigoBloqueo(flight, amadeusSession, contador);
        }
    }
    else {
        response = await intentarConCodigoBloqueo(flight, amadeusSession, contador);
    }
    return response;
};
// Llamar al servicio Amadeus
const llamarAmadeus = async (flight, amadeusSession, contador) => {
    const { data: response, headers } = await (0, ITLamadeus_external_1.getAmadeus)({ flights: [flight] }, amadeusSession);
    let successCallToExternalServices = false;
    let allOkInBookingProcess = true;
    let errorCode = '';
    if (response) {
        if (headers.amadeussession) {
            amadeusSession = headers.amadeussession;
        }
        const errorFreeText = syncFlightIds(flight, response.pnr);
        successCallToExternalServices = true;
        if (!hasError(errorFreeText)) {
            allOkInBookingProcess = false;
            errorCode = errorFreeText;
            flight.amadeusErrorCode?.push({ amadeusErrorCode: errorCode, statusCode: flight.statusCode });
        }
    }
    return { successCallToExternalServices, allOkInBookingProcess, amadeusSession, errorCode };
};
// Actualizar flight con los datos de Amadeus
const syncFlightIds = (flight, Pnr) => {
    let errorFreeText = '';
    const foundBookedFlight = Pnr.originDestinationDetails[0].itineraryInfo.find((bookedFlight) => {
        const isDestinationAirportOK = flight.airportCodeDestination.toUpperCase() === bookedFlight.travelProduct.offpointDetail.cityCode.toUpperCase();
        const isDepartureAirportOk = flight.airportCodeOrigin.toUpperCase() === bookedFlight.travelProduct.boardpointDetail.cityCode.toUpperCase();
        const isDepartureDateOk = flight.departureDate === bookedFlight.travelProduct.product.depDate;
        const isNumFlightOk = flight.flightNumber.toString().replace(LEADING_ZERO, '') === bookedFlight.travelProduct.productDetails.identification.toString().replace(LEADING_ZERO, '');
        return isDepartureAirportOk && isDestinationAirportOK && isDepartureDateOk && isNumFlightOk;
    });
    if (foundBookedFlight) {
        errorFreeText = foundBookedFlight.errorInfo?.errorWarningDescription.freeText;
        if (!hasError(errorFreeText)) {
            flight.amadeusId = foundBookedFlight.elementManagementItinerary.reference.number;
            flight.fullArrivalDate = formatDate(foundBookedFlight.travelProduct.product.arrDate, foundBookedFlight.travelProduct.product.arrTime);
            flight.fullDepartureDate = formatDate(foundBookedFlight.travelProduct.product.depDate, foundBookedFlight.travelProduct.product.depTime);
            flight.amadeusStatusCode = foundBookedFlight.relatedProduct.status[0];
        }
    }
    return errorFreeText;
};
// TODO: puede que el error este aqui
// Intentar con códigos de bloqueo 
const intentarConCodigoBloqueo = async (flight, amadeusSession, contador) => {
    let errorCode = '';
    let response = { successCallToExternalServices: false, allOkInBookingProcess: false, amadeusSession, errorCode, flight };
    for (const codigoBloqueo of flight.codigoBloqueo) {
        flight.statusCode = codigoBloqueo?.toString();
        const { successCallToExternalServices, amadeusSession: nuevaSesion, errorCode: newErrorCode } = await llamarAmadeus(flight, amadeusSession, contador);
        amadeusSession = nuevaSesion;
        if (newErrorCode) {
            errorCode = newErrorCode;
        }
        if (successCallToExternalServices) {
            response = { successCallToExternalServices: true, allOkInBookingProcess: true, amadeusSession, errorCode: '', flight };
            break;
        }
    }
    return response;
};
// Chequear si hay error en la respuesta
const hasError = (freeText) => {
    return freeText !== null && freeText !== FREE_TEXT_AMA_ERROR && freeText !== undefined && freeText[0] !== undefined;
};
// Process Amadeus Error
const processFail = async (itlBooking, amadeusSession) => {
    const newItlBooking = {};
    newItlBooking.ignorePNR = true;
    await (0, ITLamadeus_external_1.getAmadeus)(newItlBooking, amadeusSession);
    return { itlBooking, amadeusSession, allOkInBookingProcess: false };
};
exports.processFail = processFail;
// Format date to correct format (spanish)
const formatDate = (dateStr, timeStr) => {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = '20' + dateStr.substring(4, 6);
    const hours = timeStr.substring(0, 2);
    const minutes = timeStr.substring(2, 4);
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};
const finishBooking = async (itlBooking, amadeusSession) => {
    try {
        return await (0, ITLamadeus_external_1.getAmadeus)(itlBooking, amadeusSession);
    }
    catch (error) {
        aea_logger_1.logger.error('Error al finalizar la reserva:', error);
        return false;
    }
};
exports.finishBooking = finishBooking;
const addPassengers = async (passengers, amadeusSession) => {
    try {
        const { data: response, headers } = await (0, ITLamadeus_external_1.getAmadeus)(passengers, amadeusSession);
        return response ? { data: response, headers } : null;
    }
    catch (error) {
        aea_logger_1.logger.error('Error al obtener datos de pasajeros:', error);
        throw error;
    }
};
const processAndAddPaxes = (itlBooking, data, type) => {
    let allOkInBookingProcess = true;
    const pnr = data.pnr;
    const passengers = itlBooking[type];
    if (!passengers || passengers.length === 0) {
        console.warn(`No se encontraron pasajeros para ${type}.`);
        return { allOkInBookingProcess };
    }
    if (!pnr?.travellerInfo) {
        console.warn(`No se encontraron datos de travellerInfo en el PNR para ${type}.`);
        return { allOkInBookingProcess };
    }
    pnr.travellerInfo.forEach((traveller) => {
        const errorDetails = traveller?.nameError?.errorOrWarningCodeDetails?.errorDetails;
        const freeText = traveller?.nameError?.errorWarningDescription?.freeText?.join(" ") || "";
        const passengerData = traveller?.passengerData?.[0]?.travellerInformation;
        const surname = passengerData?.traveller?.surname;
        const firstName = passengerData?.passenger?.[0]?.firstName;
        const referenceNumber = traveller?.elementManagementPassenger?.reference?.number;
        passengers.forEach(passenger => {
            if (passenger.firstName?.toUpperCase() === firstName?.toUpperCase() &&
                passenger.surname?.toUpperCase() === surname?.toUpperCase()) {
                passenger.amadeusId = referenceNumber;
                if (errorDetails) {
                    allOkInBookingProcess = false;
                    passenger.amaError = {
                        errorCode: errorDetails?.errorCode || DEFAULT_ERROR_CODE,
                        category: errorDetails?.errorCategory || DEFAULT_ERROR_CATEGORY,
                        owner: errorDetails?.errorCodeOwner || DEFAULT_ERROR_OWNER,
                        description: freeText,
                    };
                }
            }
        });
    });
    itlBooking[type] = passengers;
    return { allOkInBookingProcess };
};
exports.processAndAddPaxes = processAndAddPaxes;
const processPassengers = async (itlBooking, amadeusSession) => {
    try {
        let newAmadeusSession = '';
        let allOkInBookingProcess = true;
        if (itlBooking.adults && itlBooking.adults.length > 0) {
            const response = await addPassengers({ adults: itlBooking.adults }, amadeusSession);
            const result = (0, exports.processAndAddPaxes)(itlBooking, response?.data, "adults");
            if (response) {
                const { data, headers } = response;
                newAmadeusSession = headers.amadeussession;
            }
            allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
        }
        if (itlBooking.childs && itlBooking.childs.length > 0) {
            const filteredBooking = {
                adults: itlBooking.adults,
                childs: itlBooking.childs
            };
            const passengerResponse = await addPassengers(filteredBooking, amadeusSession);
            if (passengerResponse) {
                const { data, headers } = passengerResponse;
                newAmadeusSession = headers.amadeussession;
                const result = (0, exports.processAndAddPaxes)(itlBooking, data, "childs");
                allOkInBookingProcess = allOkInBookingProcess && result.allOkInBookingProcess;
            }
        }
        return { itlBooking, allOkInBookingProcess, newAmadeusSession }; // devuelves la nueva pero que solo se habrá puesto si vienen niños
    }
    catch (error) {
        aea_logger_1.logger.error("Error en iterarPasajeros:", error);
        throw error;
    }
};
exports.processPassengers = processPassengers;
