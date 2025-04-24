import { FastifyInstance } from "fastify";
import { seatMapController } from "../controllers/seatMap.controller";
import { SeatMapRequest } from "../interfaces/interface.index";

const postItlSeatMap = (app: FastifyInstance): void => {

    app.post<{ Body: SeatMapRequest, Headers: { Authorization: string } }>(

        "/itlSeatMap",
        {
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
                        idReserva: { type: "string" },
                    },
                    required: ["departure", "arrival", "flightNumber", "departureDate", "selectSeat", "idReserva"],
                },
            },
        },
        seatMapController,
    );
};

module.exports = postItlSeatMap;
