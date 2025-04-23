import { Booking } from "./interface.index";

export interface ProcessFlight {
    itlBooking: Booking; 
    amadeusSession: string | undefined; 
    allOkInBookingProcess: boolean,
    localizador ?: string;
}