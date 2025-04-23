"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGyms = exports.formatDate = void 0;
const axios_1 = require("axios");
const getGyms = async (vuelo) => {
    const url = ``;
    const headers = {
        contentType: 'application/json'
    };
    const formattedDate = formatDate(vuelo.departureDate.toString());
    const object = {
        flightNumber: vuelo.flightNumber,
        departureAirport: vuelo.airportCodeOrigin,
        arrivalAirport: vuelo.airportCodeDestination,
        flightDate: formattedDate,
        type: "V",
        classCode: vuelo.cabinClass,
        passengerNumber: vuelo.ticketsNumber
    };
    try {
        return (await axios_1.default.post(url, object, { headers })).data;
    }
    catch (error) {
        console.error('Error gyms');
    }
};
exports.getGyms = getGyms;
const formatDate = (dateString) => {
    if (dateString.length !== 6) {
        throw new Error("La cadena de fecha debe tener 6 caracteres en formato DDMMYY");
    }
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 6);
    const fullYear = `20${year}`;
    return `${day}/${month}/${fullYear}`;
};
exports.formatDate = formatDate;
