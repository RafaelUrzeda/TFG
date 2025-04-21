import { constants as httpcodes } from "http2";
import { FlightDB } from "src/interfaces/vuelosDb.interface";
import { flightNotFoundError } from "../common/errors/flightNotFoundError";

// no inputs, no id servicios o no id solicitud
const notFoundFlight = (datos: FlightDB[] | []) => {
    if (datos.length === 0) {
        throw new flightNotFoundError(
            'Validar los Vuelos',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'Vuelo no encontrado'
        );
    }
}

const validationInputs = (idReserva: number) => {
    if (!idReserva) {
        throw new flightNotFoundError(
            'Sin id Reserva',
            httpcodes.HTTP_STATUS_BAD_REQUEST,
            'Faltan datos, BadRequest.'
        );
    }
}


export { notFoundFlight, validationInputs };

