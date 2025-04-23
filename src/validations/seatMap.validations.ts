import { constants as httpcodes } from "http2";
import { seatMapError } from "../common/errors/seatMapError";

// eslint-disable-next-line
export const seatMapValidation = (datos: any | string) => {
    if (datos === 'Seat map error') {
        throw new seatMapError(
            'Seat Map Error',
            httpcodes.HTTP_STATUS_NOT_FOUND,
            'Error al recuperar mapa de los asientos'
        );
    }
};


