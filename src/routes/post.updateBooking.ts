import { FastifyInstance } from "fastify";
import { itlUpdateBookingController } from "../controllers/itlUpdateBooking.controllers";
import { itlUpdateBooking } from "../interfaces/interface.index";

const postITLUpdateBooking = (app: FastifyInstance): void => {
    
    app.post<{ Body: itlUpdateBooking, Headers: { Authorization: string } }>(
        "/itlUpdateBooking",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        idReserva: { type: "number" },
                        localizador: { type: "string"},
                        xsid: { type: "string" }
                    },
                    required: ['idReserva', 'localizador']
                },
            },
        },
        itlUpdateBookingController,
    );
};

module.exports = postITLUpdateBooking;
