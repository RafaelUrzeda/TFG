import { Booking, BookingData, ElementsDB, FlightDB, PaxesDB } from '../interfaces/interface.index';
import { mapPaxes } from '../mappers/pasajeros.mapper';
import { mapContactInformation, mapRF, mapResidentDiscount, mapSsrToRoot } from '../mappers/ssr.mapper';
import { mapDataFlightToMultiSegmentRequest } from '../mappers/vuelos.mapper';
import { countArnk } from '../utils/utils';
import { buscaAsiento } from './asientos.service';
import { dataBooking, dataFlight, dataPaxes, dataSsr } from './database.service';
import { finishBooking, processAndAddFlight, processPassengers } from './llamadasItlAmadeus.service';


let idReserva: string | number = 0;
const fullItlBookingService = async (idBooking: number): Promise<string> => {
    // inizialize variables
    let itlBooking: Booking = {} as Booking;
    let response;
    itlBooking.warnings = [];
    itlBooking.errors = [];

    // Start the register in database
    idReserva = idBooking.toString();
    itlBooking.idReserva = idBooking.toString();

    // get all data from database
    const [bookingData, flightData, paxData, elementsData] = await getDataBaseData(idBooking);

    // Map minimal data to start the booking process
    mapMinimalData(itlBooking, paxData, elementsData, flightData, idBooking);

    // Add the flights to the booking
    let { itlBooking: updatedItlBooking, allOkInBookingProcess } = await processAndAddFlight(itlBooking);
    itlBooking = updatedItlBooking;
    if (allOkInBookingProcess === false) {
        return JSON.stringify(itlBooking);
    }

    // Add the passengers to the booking
    const addPassengersResult = await processPassengers(itlBooking);
    ({ itlBooking: updatedItlBooking, allOkInBookingProcess } = addPassengersResult);

    itlBooking = updatedItlBooking;
    itlBooking.tkok = true;

    if (!allOkInBookingProcess) {
        console.log('Error in booking process, handling failed reservation...');
        itlBooking = await handleFailedReservation(itlBooking || '');
    } else {
        // Finish booking with minimal data to get Locata
        response = await finishBooking(itlBooking);
        const finalizada = response ? true : false;
        console.log('Finalizada:', finalizada);

        // If finish process failed, handle the error
        if (!finalizada) {
            itlBooking = await handleFailedReservation(itlBooking || '');
        } else {
            itlBooking.PNR = response|| '';
            itlBooking.idSolicitud = bookingData.IDSOLICITUD;

            // if the booking has locata, add ssr to the booking
            await buscaAsiento(itlBooking, idReserva);
            mapSsrToRoot(elementsData, itlBooking);
            itlBooking = mapResidentDiscount(elementsData, itlBooking);
            itlBooking.contactInformation = [];
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

const handleFailedReservation = async (itlBooking: Booking): Promise<Booking> => {
    itlBooking.ignorePNR = true;
    const response = await finishBooking(itlBooking);
    itlBooking.PNR = response?.data?.pnr || '';

    return itlBooking;
};
export { fullItlBookingService };

