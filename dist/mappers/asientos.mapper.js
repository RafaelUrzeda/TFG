"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nuevoAsiento = exports.nuevaFila = void 0;
const nuevaFila = (numero) => {
    return {
        fila: numero,
        asientosDisponibles: 0,
        asientos: [],
        pasillos: 0,
        gruposLibres: []
    };
};
exports.nuevaFila = nuevaFila;
const nuevoAsiento = () => {
    return {
        columna: '',
        esAsiento: false,
        disponible: false,
        extras: []
    };
};
exports.nuevoAsiento = nuevoAsiento;
