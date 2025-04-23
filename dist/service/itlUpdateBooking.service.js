"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullItlUpdateBookingService = exports.mapTravellerInfo = exports.sanitizeAmadeusErrors = exports.getDataBaseData = void 0;
const infoSol_database_1 = require("../database/infoSol.database");
const amadeusCommand_external_1 = require("../externals/amadeusCommand.external");
const finishSessionAma_external_1 = require("../externals/finishSessionAma.external");
const ITLamadeus_external_1 = require("../externals/ITLamadeus.external");
const pnrAmadeus_external_1 = require("../externals/pnrAmadeus.external");
const pasajeros_mapper_1 = require("../mappers/pasajeros.mapper");
const ssr_mapper_1 = require("../mappers/ssr.mapper");
const vuelos_mapper_1 = require("../mappers/vuelos.mapper");
const database_service_1 = require("./database.service");
const llamadasItlAmadeus_service_1 = require("./llamadasItlAmadeus.service");
const procesaPnr_service_1 = require("./procesaPnr.service");
const fullItlUpdateBookingService = async (idReserva, token, localizador) => {
    const amaData = {
        pnr: null,
        headers: null,
        amadeussession: null,
        token: token,
        locata: localizador
    };
    const itlBooking = {};
    await (0, infoSol_database_1.startRegister)(idReserva);
    const [bookingData, paxes, elements, flight] = await (0, exports.getDataBaseData)(idReserva);
    itlBooking.idReserva = idReserva.toString();
    itlBooking.idSolicitud = bookingData.IDSOLICITUD;
    await getPNR(amaData);
    await (0, infoSol_database_1.actualizarAmadeusSession)(idReserva, amaData.amadeussession);
    addDataToBooking(itlBooking, elements, paxes, flight, idReserva, amaData.pnr);
    // process passengers
    const nuCommands = await mapTravellerInfoFomDB(itlBooking);
    await executeCommandList(nuCommands, token, amaData);
    //update object pnr
    await (0, exports.sanitizeAmadeusErrors)(amaData);
    await getPNR(amaData);
    syncPassengerIds(itlBooking, amaData.pnr);
    // delete elements from pnr
    const responseDeletedElements = await (0, procesaPnr_service_1.deleteElements)(amaData.pnr, amaData.amadeussession, token);
    amaData.amadeussession = responseDeletedElements.headers.amadeussession;
    // add elements to booking object	
    addElementsToBookingObject(itlBooking, elements);
    itlBooking.tkok = true;
    const booking = await (0, llamadasItlAmadeus_service_1.finishBooking)(itlBooking, amaData.amadeussession);
    itlBooking.PNR = booking?.data?.pnr || '';
    if (booking.headers.amadeussession) {
        itlBooking.localizador = localizador;
        itlBooking.amadeussession = amaData.amadeussession;
        await (0, infoSol_database_1.establecerCorrecto)(itlBooking);
    }
    else {
        await (0, infoSol_database_1.establecerIncorrecto)(itlBooking);
    }
    await (0, finishSessionAma_external_1.postFinishSessionAma)(amaData.amadeussession);
    return JSON.stringify(itlBooking);
};
exports.fullItlUpdateBookingService = fullItlUpdateBookingService;
const addDataToBooking = (itlBooking, elements, paxes, flight, idReserva, pnr) => {
    (0, pasajeros_mapper_1.mapPaxes)(paxes, itlBooking);
    (0, vuelos_mapper_1.mapDataFlightToMultiSegmentRequest)(itlBooking, flight, idReserva);
    syncFlightIds(itlBooking, pnr);
    addElementsToBookingObject(itlBooking, elements);
};
const getPNR = async (amaData) => {
    let response;
    if (amaData.amadeussession !== null) {
        response = await (0, pnrAmadeus_external_1.getAmadeusPNR)(amaData.locata, amaData.token, amaData.amadeussession);
    }
    else {
        response = await (0, pnrAmadeus_external_1.getAmadeusPNR)(amaData.locata, amaData.token);
    }
    amaData.pnr = response.data;
    amaData.headers = response.headers;
    amaData.amadeussession = response.headers.amadeussession;
};
const getDataBaseData = async (idBooking) => {
    const paxes = await (0, database_service_1.dataPaxes)(idBooking);
    const elements = await (0, database_service_1.dataSsr)(idBooking);
    const bookingData = await (0, database_service_1.dataBooking)(idBooking);
    const flight = await (0, database_service_1.dataFlight)(idBooking);
    return [bookingData, paxes, elements, flight];
};
exports.getDataBaseData = getDataBaseData;
const mapTravellerInfoFomDB = async (pasajerosMapped) => {
    const nuCommand = [];
    pasajerosMapped.adults?.forEach((pax) => {
        nuCommand.push(`NU${pax.id}/1${pax.nombreAmadeus}`);
    });
    pasajerosMapped.childs?.forEach((pax) => {
        nuCommand.push(`NU${pax.id}/1${pax.nombreAmadeus}`);
    });
    return nuCommand;
};
// TODO solucion temporal, es para funcione o no el NU se sanee la sesion
const sanitizeAmadeusErrors = async (amaData) => {
    const newItlBooking = {};
    newItlBooking.ignorePNR = true;
    const response = await (0, ITLamadeus_external_1.getAmadeus)(newItlBooking, amaData.amadeussession);
    amaData.amadeussession = response?.headers.amadeussession;
};
exports.sanitizeAmadeusErrors = sanitizeAmadeusErrors;
const executeCommandList = async (nuCommands, token, amaData) => {
    for (let i = 0; i < nuCommands.length; i++) {
        const command = nuCommands[i];
        const response = await (0, amadeusCommand_external_1.postAmadeusCommand)(command, token, amaData.amadeussession);
        amaData.amadeussession = response?.headers.amadeussession || '';
    }
    const rfCommand = "RF Updated Name Interline API";
    const rfResponse = await (0, amadeusCommand_external_1.postAmadeusCommand)(rfCommand, token, amaData.amadeussession);
    amaData.amadeussession = rfResponse?.headers.amadeussession;
    const etCommand = "ET";
    const etResponse = await (0, amadeusCommand_external_1.postAmadeusCommand)(etCommand, token, amaData.amadeussession);
    amaData.amadeussession = etResponse?.headers.amadeussession;
};
const addElementsToBookingObject = (itlBooking, elementsData) => {
    const conditions = [
        'FD',
        'FZ',
        'DOCS',
        'CTCE',
        'APE',
        'CTCM',
        'CKIN',
        'AP',
        'SR',
        'FP',
        'RF'
    ];
    const elementosToMap = elementsData.filter((element) => conditions.some((condition) => condition === element.TIPOELEMENTO));
    (0, ssr_mapper_1.mapSsrToRoot)(elementosToMap, itlBooking);
    (0, ssr_mapper_1.mapResidentDiscount)(elementosToMap, itlBooking);
    (0, ssr_mapper_1.mapContactInformation)(elementsData, itlBooking);
    (0, ssr_mapper_1.mapRF)(elementsData, itlBooking);
};
const syncFlightIds = (itlBooking, Pnr) => {
    itlBooking.flights?.forEach((flight) => {
        const foundBookedFlight = Pnr.originDestinationDetails[0].itineraryInfo.find((bookedFlight) => {
            const isDestinationAirportOK = flight.airportCodeDestination.toUpperCase() === bookedFlight.travelProduct.offpointDetail.cityCode.toUpperCase();
            const isDepartureAirportOk = flight.airportCodeOrigin.toUpperCase() === bookedFlight.travelProduct.boardpointDetail.cityCode.toUpperCase();
            const isDepartureDateOk = flight.departureDate === bookedFlight.travelProduct.product.depDate;
            const isNumFlightOk = flight.flightNumber.toString().replace(/^0+/, '') === bookedFlight.travelProduct.productDetails.identification.toString().replace(/^0+/, '');
            return isDepartureAirportOk && isDestinationAirportOK && isDepartureDateOk && isNumFlightOk;
        });
        if (foundBookedFlight)
            flight.amadeusId = foundBookedFlight.elementManagementItinerary.reference.number;
    });
};
const syncPassengerIds = (itlBooking, Pnr) => {
    itlBooking.adults?.forEach(passenger => {
        const foundBookedPassenger = Pnr.travellerInfo.find((bookedPassenger) => {
            return findPassenger(passenger, bookedPassenger, undefined);
        });
        if (foundBookedPassenger)
            passenger.amadeusId = foundBookedPassenger.elementManagementPassenger.reference.number;
    });
    itlBooking.childs?.forEach(passenger => {
        const foundBookedPassenger = Pnr.travellerInfo.find((bookedPassenger) => {
            return findPassenger(passenger, bookedPassenger, 'CHD');
        });
        if (foundBookedPassenger)
            passenger.amadeusId = foundBookedPassenger.elementManagementPassenger.reference.number;
    });
};
const findPassenger = (passenger, bookedPassenger, typeOfPassenger) => {
    const isSurnameOk = bookedPassenger?.passengerData[0]?.travellerInformation?.traveller?.surname?.toUpperCase() === passenger.surname.toUpperCase();
    const isFirstNameOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.firstName?.toUpperCase() === passenger.firstName.toUpperCase();
    let isTypeOfPassengerOk;
    if (!typeOfPassenger) {
        isTypeOfPassengerOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.type === undefined;
    }
    else {
        isTypeOfPassengerOk = bookedPassenger?.passengerData[0]?.travellerInformation?.passenger[0]?.type === typeOfPassenger;
    }
    return isSurnameOk && isFirstNameOk && isTypeOfPassengerOk;
};
const mapTravellerInfo = async (PNR, pasajerosMapped) => {
    const unUpdatedPassengers = [];
    const nuCommands = [];
    PNR.travellerInfo.forEach((traveller) => {
        const referenceId = traveller.elementManagementPassenger.reference.number;
        const lineNumber = traveller.elementManagementPassenger.lineNumber;
        let foundMatch = false;
        traveller.passengerData.forEach((passenger) => {
            const { traveller, passenger: passengerList } = passenger.travellerInformation;
            passengerList.forEach((pax) => {
                const firstName = pax.firstName.trim().toUpperCase();
                const surname = traveller.surname.trim().toUpperCase();
                const matchingPassenger = [...(pasajerosMapped.adults || []), ...(pasajerosMapped.childs || [])].find(p => p.firstName.trim().toUpperCase() === firstName &&
                    p.surname.trim().toUpperCase() === surname);
                if (matchingPassenger) {
                    foundMatch = true;
                }
            });
        });
        if (!foundMatch) {
            unUpdatedPassengers.push({
                lineNumber, referenceId,
                firstName: '',
                surname: ''
            });
        }
    });
    // TODO Too many somes
    (pasajerosMapped.adults || []).concat((pasajerosMapped.childs || []).map(child => ({
        ...child,
        hasInfants: false
    }))).forEach(pasajero => {
        const notInPNR = !PNR.travellerInfo.some((traveller) => traveller.passengerData.some((passenger) => passenger.travellerInformation.passenger.some((pax) => pax.firstName.trim().toUpperCase() === pasajero.firstName.trim().toUpperCase() &&
            passenger.travellerInformation.traveller.surname.trim().toUpperCase() === pasajero.surname.trim().toUpperCase())));
        if (notInPNR) {
            const lineNumber = unUpdatedPassengers.length > 0 ? unUpdatedPassengers[0].lineNumber : 1;
            nuCommands.push(`NU${lineNumber}/1${pasajero.surname}/${pasajero.firstName}`);
        }
    });
    return nuCommands;
};
exports.mapTravellerInfo = mapTravellerInfo;
