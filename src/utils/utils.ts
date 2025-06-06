import { Booking } from "src/interfaces/jsonResponse.interface";

//TODO El fichero generico de utils con la funcion de utils menos generica
export const countArnk = (itlBooking: Booking)=> {
    let count = 0;
    
    if (!itlBooking.flights || itlBooking.flights.length === 0) {
        return count;
    }
    // Iterate to the second-to-last flight to avoid accessing outside the array bounds
    for (let i = 0; i < itlBooking.flights.length - 1; i++) {
        if (itlBooking.flights[i].airportCodeDestination !== itlBooking.flights[i + 1].airportCodeOrigin) {
            count++;
        }
    }
};


