"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationInputs = exports.notFoundFlight = void 0;
const http2_1 = require("http2");
const flightNotFoundError_1 = require("../common/errors/flightNotFoundError");
// no inputs, no id servicios o no id solicitud
const notFoundFlight = (datos) => {
    if (datos.length === 0) {
        throw new flightNotFoundError_1.flightNotFoundError('Validar los Vuelos', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'Vuelo no encontrado');
    }
};
exports.notFoundFlight = notFoundFlight;
const validationInputs = (idReserva) => {
    if (!idReserva) {
        throw new flightNotFoundError_1.flightNotFoundError('Sin id Reserva', http2_1.constants.HTTP_STATUS_BAD_REQUEST, 'Faltan datos, BadRequest.');
    }
};
exports.validationInputs = validationInputs;
