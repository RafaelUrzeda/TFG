"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataBooking = exports.dataFlight = exports.dataSsr = exports.dataPaxes = void 0;
const infoSol_database_1 = require("../database/infoSol.database");
const elementos_validations_1 = require("../validations/elementos.validations");
const pasajeros_validation_1 = require("../validations/pasajeros.validation");
const vuelos_validations_1 = require("../validations/vuelos.validations");
const dataPaxes = async (idBooking) => {
    const data = await (0, infoSol_database_1.itlPasajeros)(idBooking) || [];
    (0, pasajeros_validation_1.notFoundPax)(data);
    return data;
};
exports.dataPaxes = dataPaxes;
const dataSsr = async (idBooking) => {
    const data = await (0, infoSol_database_1.itlElements)(idBooking) || [];
    (0, elementos_validations_1.notFoundElement)(data);
    return data;
};
exports.dataSsr = dataSsr;
const dataFlight = async (idBooking) => {
    const data = await (0, infoSol_database_1.itlVuelos)(idBooking) || [];
    (0, vuelos_validations_1.notFoundFlight)(data);
    return data;
};
exports.dataFlight = dataFlight;
const dataBooking = async (idBooking) => {
    const data = await (0, infoSol_database_1.itlReservas)(idBooking);
    if (!data) {
        throw new Error('No se encontraron datos de la reserva');
    }
    return data;
};
exports.dataBooking = dataBooking;
