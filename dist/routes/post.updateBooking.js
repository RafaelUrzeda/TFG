"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itlUpdateBooking_controllers_1 = require("../controllers/itlUpdateBooking.controllers");
const postITLUpdateBooking = (app) => {
    app.post("/itlUpdateBooking", {
        schema: {
            body: {
                type: "object",
                properties: {
                    idReserva: { type: "number" },
                    localizador: { type: "string" },
                    xsid: { type: "string" }
                },
                required: ['idReserva', 'localizador']
            },
        },
    }, itlUpdateBooking_controllers_1.itlUpdateBookingController);
};
module.exports = postITLUpdateBooking;
