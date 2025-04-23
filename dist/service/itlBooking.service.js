"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullItlBookingService = void 0;
const infoSol_database_1 = require("../database/infoSol.database");
const finishSessionAma_external_1 = require("../externals/finishSessionAma.external");
const pnrAmadeus_external_1 = require("../externals/pnrAmadeus.external");
const pasajeros_mapper_1 = require("../mappers/pasajeros.mapper");
const ssr_mapper_1 = require("../mappers/ssr.mapper");
const vuelos_mapper_1 = require("../mappers/vuelos.mapper");
const utils_1 = require("../utils/utils");
const asientos_service_1 = require("./asientos.service");
const database_service_1 = require("./database.service");
const llamadasItlAmadeus_service_1 = require("./llamadasItlAmadeus.service");
const fullItlBookingService = async (idBooking) => {
    // inizialize variables
    let itlBooking = {};
    let newAmadeusSession = '';
    let response;
    itlBooking.warnings = [];
    itlBooking.errors = [];
    // Start the register in database
    await infoSol_database_1.default.startRegister(idBooking);
    itlBooking.idReserva = idBooking.toString();
    // get all data from database
    const [bookingData, flightData, paxData, elementsData] = await getDataBaseData(idBooking);
    // Map minimal data to start the booking process
    mapMinimalData(itlBooking, paxData, elementsData, flightData, idBooking);
    // Add the flights to the booking
    let { itlBooking: updatedItlBooking, amadeusSession, allOkInBookingProcess } = await (0, llamadasItlAmadeus_service_1.processAndAddFlight)(itlBooking);
    itlBooking = updatedItlBooking;
    itlBooking.amadeussession = amadeusSession;
    await infoSol_database_1.default.actualizarAmadeusSession(idBooking, amadeusSession || '');
    if (allOkInBookingProcess === false) {
        return JSON.stringify(itlBooking);
    }
    // Add the passengers to the booking
    const addPassengersResult = await (0, llamadasItlAmadeus_service_1.processPassengers)(itlBooking, amadeusSession);
    ({ itlBooking: updatedItlBooking, allOkInBookingProcess, newAmadeusSession } = addPassengersResult);
    if (newAmadeusSession !== '') {
        amadeusSession = newAmadeusSession;
    }
    itlBooking = updatedItlBooking;
    itlBooking.amadeussession = amadeusSession;
    itlBooking.tkok = true;
    if (!allOkInBookingProcess) {
        itlBooking = await handleFailedReservation(itlBooking, amadeusSession || '');
    }
    else {
        // Finish booking with minimal data to get Locata
        response = await (0, llamadasItlAmadeus_service_1.finishBooking)(itlBooking, amadeusSession);
        const finalizada = response.data.pnr ? true : false;
        // If finish process failed, handle the error
        if (!finalizada) {
            itlBooking = await handleFailedReservation(itlBooking, amadeusSession || '');
        }
        else {
            itlBooking.PNR = response?.data?.pnr || '';
            itlBooking.idSolicitud = bookingData.IDSOLICITUD;
            itlBooking.localizador = response?.data?.pnr?.pnrHeader[0].reservationInfo?.reservation?.[0]?.controlNumber || '';
            // if the booking has locata, add ssr to the booking
            if (itlBooking.localizador) {
                finalizeBooking(itlBooking, amadeusSession || '');
                await (0, asientos_service_1.buscaAsiento)(itlBooking);
                (0, ssr_mapper_1.mapSsrToRoot)(elementsData, itlBooking);
                itlBooking = (0, ssr_mapper_1.mapResidentDiscount)(elementsData, itlBooking);
                itlBooking.contactInformation = [];
                try {
                    for (let i = 0; i < 2; i++) {
                        const booking = await (0, pnrAmadeus_external_1.getAmadeusPNR)(itlBooking.localizador || '', '', amadeusSession || '');
                        amadeusSession = booking?.headers?.amadeussession;
                        response = await (0, llamadasItlAmadeus_service_1.finishBooking)(itlBooking, amadeusSession);
                        itlBooking.PNR = response?.data?.pnr || '';
                        const generalErrorInfo = response?.data?.pnr?.generalErrorInfo;
                        const freeText = generalErrorInfo && generalErrorInfo[0]?.errorWarningDescription?.freeText;
                        const firstFreeText = freeText && freeText[0] ? freeText[0] : '';
                        if (firstFreeText !== '' && firstFreeText === FREE_TEXT_AMA_ERROR) {
                            await (0, finishSessionAma_external_1.postFinishSessionAma)(amadeusSession || '');
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                }
                catch (error) {
                    console.error('Error al añadir los ssr');
                }
                await finalizeBooking(itlBooking, amadeusSession || '');
            }
            else {
                await (0, finishSessionAma_external_1.postFinishSessionAma)(amadeusSession || '');
            }
        }
    }
    itlBooking = (0, ssr_mapper_1.mapContactInformation)(elementsData, itlBooking);
    return JSON.stringify(itlBooking);
};
exports.fullItlBookingService = fullItlBookingService;
const getDataBaseData = async (idBooking) => {
    const bookingData = await (0, database_service_1.dataBooking)(idBooking);
    const flightData = await (0, database_service_1.dataFlight)(idBooking);
    const paxData = await (0, database_service_1.dataPaxes)(idBooking);
    const elementsData = await (0, database_service_1.dataSsr)(idBooking);
    return [bookingData, flightData, paxData, elementsData];
};
const mapMinimalData = (itlBooking, paxData, elementsData, flightData, idBooking) => {
    (0, pasajeros_mapper_1.mapPaxes)(paxData, itlBooking);
    (0, ssr_mapper_1.mapContactInformation)(elementsData, itlBooking);
    (0, vuelos_mapper_1.mapDataFlightToMultiSegmentRequest)(itlBooking, flightData, idBooking);
    (0, utils_1.countArnk)(itlBooking);
    (0, ssr_mapper_1.mapRF)(elementsData, itlBooking);
};
const handleFailedReservation = async (itlBooking, amadeusSession) => {
    itlBooking.ignorePNR = true;
    const response = await (0, llamadasItlAmadeus_service_1.finishBooking)(itlBooking, amadeusSession);
    itlBooking.PNR = response?.data?.pnr || '';
    await infoSol_database_1.default.establecerIncorrecto(itlBooking);
    await (0, finishSessionAma_external_1.postFinishSessionAma)(amadeusSession || '');
    return itlBooking;
};
const finalizeBooking = async (itlBooking, amadeusSession) => {
    await infoSol_database_1.default.establecerCorrecto(itlBooking);
    await (0, finishSessionAma_external_1.postFinishSessionAma)(amadeusSession || '');
};
const FREE_TEXT_AMA_ERROR = 'SIMULTANEOUS CHANGES TO PNR - USE WRA/RT TO PRINT OR IGNORE';
