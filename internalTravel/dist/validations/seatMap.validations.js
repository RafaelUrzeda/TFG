"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seatMapValidation = void 0;
const http2_1 = require("http2");
const seatMapError_1 = require("../common/errors/seatMapError");
// eslint-disable-next-line
const seatMapValidation = (datos) => {
    if (datos === 'Seat map error') {
        throw new seatMapError_1.seatMapError('Seat Map Error', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'Error al recuperar mapa de los asientos');
    }
};
exports.seatMapValidation = seatMapValidation;
