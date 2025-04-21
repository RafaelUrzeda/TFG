"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itlGetPnr_controller_1 = require("../controllers/itlGetPnr.controller");
const postITLBooking = (app) => {
    app.post("/itlGetPnr", {
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
    }, itlGetPnr_controller_1.itlGetPnr);
};
module.exports = postITLBooking;
