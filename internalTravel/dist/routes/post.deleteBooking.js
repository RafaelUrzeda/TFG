"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itlDeleteBooking_controllers_1 = require("../controllers/itlDeleteBooking.controllers");
const postITLBooking = (app) => {
    app.post("/itlDeleteBooking", {
        schema: {
            body: {
                type: "object",
                properties: {
                    locata: { type: "string" },
                    xsid: { type: "string" }
                },
                required: ['locata']
            },
        },
    }, itlDeleteBooking_controllers_1.itlDeleteBooking);
};
module.exports = postITLBooking;
