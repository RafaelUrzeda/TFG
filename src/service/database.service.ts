import { itlElements, itlPasajeros, itlReservas, itlVuelos } from '../database/infoSol.database';
import { BookingData, ElementsDB, FlightDB, PaxesDB } from '../interfaces/interface.index';
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