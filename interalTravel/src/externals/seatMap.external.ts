import axios from "axios";
import { Flight, SeatMapRequest } from "../interfaces/interface.index";


const formatDate = (date: string): string => {
    const day = date.substring(0, 2);
    const month = date.substring(2, 4);
    const year = '20' + date.substring(4, 6);
    return `${day}-${month}-${year}`;
};
const getSeatMap = async (booking: Flight | undefined, seatMapRequest?: SeatMapRequest): Promise<any> => {
    const url = ``;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': ``,
    };
    let formattedDate;
    let params;
    // Normalización de los atributos según el tipo de objeto
    if (booking !== undefined) {
        formattedDate = formatDate(booking.departureDate);
        params = {
            departure: booking.airportCodeOrigin,
            arrival: booking.airportCodeDestination,
            flightNumber: booking.flightNumber,
            departureDate: formattedDate
        };
    } else if (seatMapRequest) {
        formattedDate = formatDate(seatMapRequest?.departureDate);
        params = {
            departure: seatMapRequest.departure,
            arrival: seatMapRequest.arrival,
            flightNumber: seatMapRequest.flightNumber,
            departureDate: formattedDate
        };
    }

    const queryString = new URLSearchParams(params as any).toString();

        const response = await axios.get(`${url}?${queryString}`, { headers });
        return response.data;
    };


export { formatDate, getSeatMap };

