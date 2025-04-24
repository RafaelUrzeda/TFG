export interface SeatMapRequest {
    isSeatMapRequest?: boolean;
    departure: string;
    arrival: string;
    flightNumber: number;
    departureDate: string;
    cabinClass?: string;
    selectSeat: boolean;
    selectSeatMapParams?: selectSeatParams;
    idReserva?: string;
}

export interface selectSeatParams {
    totalPassengers: number;
    initialRow: number;
    XLSeat: boolean;
    emergency: boolean;
    businessClass: boolean;
}

export interface SeatMapResponse {
    seatMap: any;
    customSeats?: { seatNumber: string }[];

}