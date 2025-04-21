import { getCodigosAmadeus, itlElements, itlPasajeros, itlReservas, itlVuelos, updateSolicitudesVuelo } from '../database/infoSol.database';
import { Booking, BookingData, ElementsDB, FlightDB, PaxesDB } from '../interfaces/interface.index';
import { notFoundElement } from '../validations/elementos.validations';
import { notFoundPax } from '../validations/pasajeros.validation';
import { notFoundFlight } from '../validations/vuelos.validations';

export const dataPaxes = async (idBooking: number): Promise<PaxesDB[]> => {
    const data: PaxesDB[] | [] = await itlPasajeros(idBooking) || [];
    notFoundPax(data);
    return data;
};

export const dataSsr = async (idBooking: number,): Promise<ElementsDB[]> => {
    const data: ElementsDB[] | [] = await itlElements(idBooking) || [];
    notFoundElement(data);
    return data;
};


export const dataFlight = async (idBooking: number): Promise<FlightDB[]> => {
    const data: FlightDB[] | [] = await itlVuelos(idBooking) || [];
    notFoundFlight(data);
    return data;
};

export const dataBooking = async (idBooking: number): Promise<BookingData> => {
    const data: BookingData = await itlReservas(idBooking);
    if (!data) {
        throw new Error('No se encontraron datos de la reserva');
    }
    return data;
};

export const updateTables = async (itlBooking: Booking) => {
    for (const flight of itlBooking.flights || []) {
        if (flight.idReserva) {
            const statusCodes: any = await getCodigosAmadeus(flight.amadeusStatusCode || "");
            const params = {
                idsol: itlBooking.idSolicitud,
                timdep: flight.fullDepartureDate,
                timarr: flight.fullArrivalDate,
                seqser: flight.seqser,
                locata: itlBooking.localizador,
                staserv: statusCodes.ESTADOSVC,
                stablq: statusCodes.CODIGOBLQ
            }
            await updateSolicitudesVuelo(params);
        }
    }
}