import database from '../database/infoSol.database';
import { postFinishSessionAma } from '../externals/finishSessionAma.external';
import { getAmadeusPNR } from '../externals/pnrAmadeus.external';
import { Booking, BookingData, ElementsDB, FlightDB, PaxesDB } from '../interfaces/interface.index';
import { mapPaxes } from '../mappers/pasajeros.mapper';
import { mapContactInformation, mapRF, mapResidentDiscount, mapSsrToRoot } from '../mappers/ssr.mapper';
import { mapDataFlightToMultiSegmentRequest } from '../mappers/vuelos.mapper';
import { countArnk } from '../utils/utils';
import { buscaAsiento } from './asientos.service';
import { dataBooking, dataFlight, dataPaxes, dataSsr } from './database.service';
import { finishBooking, processAndAddFlight, processPassengers } from './llamadasItlAmadeus.service';

const fullItlBookingService = async (idBooking: number): Promise<string> => {

    // inizialize variables
    let itlBooking: Booking = {} as Booking;
    let newAmadeusSession: string | undefined = '';
    let response;
    itlBooking.warnings = [];
    itlBooking.errors = [];

    // Start the register in database
    await database.startRegister(idBooking);
    itlBooking.idReserva = idBooking.toString();

    // get all data from database
    const [bookingData, flightData, paxData, elementsData] = await getDataBaseData(idBooking);

    // Map minimal data to start the booking process
    mapMinimalData(itlBooking, paxData, elementsData, flightData, idBooking);

    // Add the flights to the booking
    let { itlBooking: updatedItlBooking, amadeusSession, allOkInBookingProcess } = await processAndAddFlight(itlBooking);
    itlBooking = updatedItlBooking;
    itlBooking.amadeussession = amadeusSession;
    await database.actualizarAmadeusSession(idBooking, amadeusSession || '');

    if (allOkInBookingProcess === false) {
        return JSON.stringify(itlBooking);
    }

    // Add the passengers to the booking
    const addPassengersResult = await processPassengers(itlBooking, amadeusSession);
    ({ itlBooking: updatedItlBooking, allOkInBookingProcess, newAmadeusSession } = addPassengersResult);
    if (newAmadeusSession !== '') {
        amadeusSession = newAmadeusSession;
    }
    itlBooking = updatedItlBooking;
    itlBooking.amadeussession = amadeusSession;
    itlBooking.tkok = true;
    
    if (!allOkInBookingProcess) {
        itlBooking = await handleFailedReservation(itlBooking, amadeusSession || '');
    } else {
        // Finish booking with minimal data to get Locata
        response = await finishBooking(itlBooking, amadeusSession);
        const finalizada = response.data.pnr ? true : false;

        // If finish process failed, handle the error
        if (!finalizada) {
            itlBooking = await handleFailedReservation(itlBooking, amadeusSession || '');
        } else {
            itlBooking.PNR = response?.data?.pnr || '';
            itlBooking.idSolicitud = bookingData.IDSOLICITUD;
            itlBooking.localizador = response?.data?.pnr?.pnrHeader[0].reservationInfo?.reservation?.[0]?.controlNumber || '';

            // if the booking has locata, add ssr to the booking
            if (itlBooking.localizador) {
                finalizeBooking(itlBooking, amadeusSession || '');
                await buscaAsiento(itlBooking);
                mapSsrToRoot(elementsData, itlBooking);
                itlBooking = mapResidentDiscount(elementsData, itlBooking);
                itlBooking.contactInformation = [];
                try {
                    for (let i = 0; i < 2; i++) {
                        const booking = await getAmadeusPNR(itlBooking.localizador || '', '', amadeusSession || '');
                        amadeusSession = booking?.headers?.amadeussession;
                        response = await finishBooking(itlBooking, amadeusSession);
                        itlBooking.PNR = response?.data?.pnr || '';
                        const generalErrorInfo = response?.data?.pnr?.generalErrorInfo;
                        const freeText = generalErrorInfo && generalErrorInfo[0]?.errorWarningDescription?.freeText;
                        const firstFreeText = freeText && freeText[0] ? freeText[0] : '';

                        if (firstFreeText !== '' && firstFreeText === FREE_TEXT_AMA_ERROR) {
                            await postFinishSessionAma( amadeusSession || '');
                            continue;
                        } else {
                            break;
                        }
                    }
                } catch (error) {
                    console.error('Error al añadir los ssr');
                }
                await finalizeBooking(itlBooking, amadeusSession || '');
            } else {
                await postFinishSessionAma( amadeusSession || '');
            }
        }
    }
    itlBooking = mapContactInformation(elementsData, itlBooking);
    return JSON.stringify(itlBooking);
};

const getDataBaseData = async (idBooking: number): Promise<[BookingData, FlightDB[], PaxesDB[], ElementsDB[]]> => {
    const bookingData: BookingData = await dataBooking(idBooking);
    const flightData: FlightDB[] = await dataFlight(idBooking);
    const paxData: PaxesDB[] = await dataPaxes(idBooking);
    const elementsData: ElementsDB[] = await dataSsr(idBooking);
    return [bookingData, flightData, paxData, elementsData];
};

const mapMinimalData = (itlBooking: Booking, paxData: PaxesDB[], elementsData: ElementsDB[], flightData: FlightDB[], idBooking: number) => {
    mapPaxes(paxData, itlBooking);
    mapContactInformation(elementsData, itlBooking);
    mapDataFlightToMultiSegmentRequest(itlBooking, flightData, idBooking);
    countArnk(itlBooking);
    mapRF(elementsData, itlBooking);
};

const handleFailedReservation = async (itlBooking: Booking, amadeusSession: string): Promise<Booking> => {
    itlBooking.ignorePNR = true;
    const response = await finishBooking(itlBooking, amadeusSession);
    itlBooking.PNR = response?.data?.pnr || '';
    await database.establecerIncorrecto(itlBooking);
    await postFinishSessionAma( amadeusSession || '');

    return itlBooking;
};

const finalizeBooking = async (itlBooking: Booking, amadeusSession: string) => {
    await database.establecerCorrecto(itlBooking);
    await postFinishSessionAma( amadeusSession || '');

};

const FREE_TEXT_AMA_ERROR = 'SIMULTANEOUS CHANGES TO PNR - USE WRA/RT TO PRINT OR IGNORE';

export { fullItlBookingService };

