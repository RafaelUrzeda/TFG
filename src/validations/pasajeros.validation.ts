import { constants as httpcodes } from "http2";
import { PaxesDB } from "src/interfaces/pasajerosDb.interface";
import { paxNotFound } from "../common/errors/passengerNotFoundError";

// Found passengers
export const notFoundPax = (datos: PaxesDB[] | []) => {
    if (datos.length === 0) {
        throw new paxNotFound(
            'Validar los Pasajeros',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'No se han encontrado pasajeros en la solicitud.'
        );
    }
}
