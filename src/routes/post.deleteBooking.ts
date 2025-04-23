import { FastifyInstance } from "fastify";
import { itlDeleteBooking } from "../controllers/itlDeleteBooking.controllers";
import { deleteBooking } from "../interfaces/interface.index";

const postITLBooking = (app: FastifyInstance): void => {

    app.post<{ Body: deleteBooking, Headers: { Authorization: string } }>(

        "/itlDeleteBooking",
        {
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
        },
        itlDeleteBooking,
    );
};

module.exports = postITLBooking;
