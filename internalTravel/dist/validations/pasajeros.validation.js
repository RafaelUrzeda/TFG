"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundPax = void 0;
const http2_1 = require("http2");
const passengerNotFoundError_1 = require("../common/errors/passengerNotFoundError");
// Found passengers
const notFoundPax = (datos) => {
    if (datos.length === 0) {
        throw new passengerNotFoundError_1.paxNotFound('Validar los Pasajeros', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'No se han encontrado pasajeros en la solicitud.');
    }
};
exports.notFoundPax = notFoundPax;
