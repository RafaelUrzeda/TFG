import { constants as httpcodes } from "http2";
import { ElementsDB } from "src/interfaces/elementosDb.interface";
import { elementsNotFoundError } from "../common/errors/elementsNotFoundError";

// Found flights
export const notFoundElement = (datos: ElementsDB[] | []) => {
    if (datos.length === 0) {
        throw new elementsNotFoundError(
            'Validar los Vuelos',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'No se han encontrado datos en la solicitud.'
        );
    }
}



