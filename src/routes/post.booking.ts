import { FastifyInstance } from "fastify";
import { itlBookingController } from "../controllers/itlBooking.controllers";
import { ITLBooking } from "../interfaces/itlBooking.interface";

const postITLBooking = (app: FastifyInstance): void => {

    app.post<{ Body: ITLBooking, Headers: { Authorization: string } }>(

        "/itlBooking",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        idReserva: { type: "number" }
                    },
                    required: ['idReserva']
                },
            },
        },
        itlBookingController,
    );

};

module.exports = postITLBooking;
