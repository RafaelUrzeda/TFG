"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatMapService = void 0;
const seatMap_external_1 = require("../externals/seatMap.external");
const asientos_service_1 = require("../service/asientos.service");
const getSeatMapService = async (flight, token) => {
    let response;
    flight.isSeatMapRequest = true;
    if (flight.selectSeat) {
        response = await (0, asientos_service_1.buscaAsiento)(undefined, flight);
    }
    else {
        response = await (0, seatMap_external_1.getSeatMap)(undefined, flight);
    }
    return response;
};
exports.getSeatMapService = getSeatMapService;
