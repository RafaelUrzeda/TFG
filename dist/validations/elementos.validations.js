"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundElement = void 0;
const http2_1 = require("http2");
const elementsNotFoundError_1 = require("../common/errors/elementsNotFoundError");
// Found flights
const notFoundElement = (datos) => {
    if (datos.length === 0) {
        throw new elementsNotFoundError_1.elementsNotFoundError('Validar los Vuelos', http2_1.constants.HTTP_STATUS_NOT_FOUND, 'No se han encontrado datos en la solicitud.');
    }
};
exports.notFoundElement = notFoundElement;
