"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatMap = exports.formatDate = void 0;
const axios_1 = require("axios");
const formatDate = (date) => {
    const day = date.substring(0, 2);
    const month = date.substring(2, 4);
    const year = '20' + date.substring(4, 6);
    return `${day}-${month}-${year}`;
};
exports.formatDate = formatDate;
const getSeatMap = async (booking, seatMapRequest) => {
    const url = ``;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': ``,
    };
    let formattedDate;
    let params;
    // Normalización de los atributos según el tipo de objeto
    if (booking !== undefined) {
        formattedDate = formatDate(booking.departureDate);
        params = {
            departure: booking.airportCodeOrigin,
            arrival: booking.airportCodeDestination,
            flightNumber: booking.flightNumber,
            departureDate: formattedDate
        };
    }
    else if (seatMapRequest) {
        formattedDate = formatDate(seatMapRequest?.departureDate);
        params = {
            departure: seatMapRequest.departure,
            arrival: seatMapRequest.arrival,
            flightNumber: seatMapRequest.flightNumber,
            departureDate: formattedDate
        };
    }
    const queryString = new URLSearchParams(params).toString();
    const response = await axios_1.default.get(`${url}?${queryString}`, { headers });
    return response.data;
};
exports.getSeatMap = getSeatMap;
