import axios from 'axios';
import { gymsObj } from '../interfaces/gymsObj.interface';
import { Flight } from '../interfaces/jsonResponse.interface';

const getGyms = async (vuelo: Flight): Promise<any> => {
    const url = ``;
    const headers = {
        contentType: 'application/json'
    };
    const formattedDate = formatDate(vuelo.departureDate.toString());
    const object: gymsObj = {
        flightNumber: vuelo.flightNumber,
        departureAirport: vuelo.airportCodeOrigin,
        arrivalAirport: vuelo.airportCodeDestination,
        flightDate: formattedDate,
        type: "V",
        classCode: vuelo.cabinClass,
        passengerNumber: vuelo.ticketsNumber
    }
    try {
        return (await axios.post(
            url,
            object,
            { headers }
        )).data;
    } catch (error) {
        console.error('Error gyms');
    }
}

const formatDate = (dateString: string): string => {
    if (dateString.length !== 6) {
        throw new Error("La cadena de fecha debe tener 6 caracteres en formato DDMMYY");
    }

    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 6);

    const fullYear = `20${year}`;

    return `${day}/${month}/${fullYear}`;
}


export { formatDate, getGyms };

