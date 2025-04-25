import { FastifyInstance } from "fastify";
import { itlGetPnr } from "../controllers/itlGetPnr.controller";
import { deleteBooking } from "../interfaces/interface.index";

const postITLBooking = (app: FastifyInstance): void => {

    app.post<{ Body: deleteBooking, Headers: { Authorization: string } }>(

        "/itlGetPnr",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        locata: { type: "number" },
                        xsid: { type: "string" }
                    },
                    required: ['locata']
                },
            },
        },
        itlGetPnr,
    );
};

module.exports = postITLBooking;
