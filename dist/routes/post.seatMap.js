"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seatMap_controller_1 = require("../controllers/seatMap.controller");
const postItlSeatMap = (app) => {
    app.post("/itlSeatMap", {
        schema: {
            body: {
                type: "object",
                properties: {
                    departure: { type: "string" },
                    cabinClass: { type: "string" },
                    arrival: { type: "string" },
                    flightNumber: { type: "number" },
                    departureDate: { type: "string" },
                    selectSeat: { type: "boolean" },
                    selectSeatParams: {
                        type: "object",
                        properties: {
                            initialRow: { type: "number" },
                            XLSeat: { type: "boolean" },
                            emergency: { type: "boolean" },
                            businessClass: { type: "boolean" },
                        },
                        required: ["initialRow", "XLSeat", "emergency", "businessClass"],
                    },
                },
                required: ["departure", "arrival", "flightNumber", "departureDate", "selectSeat"],
            },
        },
    }, seatMap_controller_1.seatMapController);
};
module.exports = postItlSeatMap;
