"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itlBooking_controllers_1 = require("../controllers/itlBooking.controllers");
const postITLBooking = (app) => {
    app.post("/itlBooking", {
        schema: {
            body: {
                type: "object",
                properties: {
                    idReserva: { type: "number" }
                },
                required: ['idReserva']
            },
        },
    }, itlBooking_controllers_1.itlBookingController);
};
module.exports = postITLBooking;
