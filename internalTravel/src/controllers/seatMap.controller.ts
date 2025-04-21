import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { SeatMapRequest } from "../interfaces/interface.index";
import { getSeatMapService } from "../service/seatMap.service";

export const seatMapController = async (
    req: FastifyRequest<{ Body: SeatMapRequest, Headers: { Authorization?: string } }>,
    res: FastifyReply,
) => {
    const object: SeatMapRequest = req.body;
    const token = req.headers.authorization || "";
    const response = await getSeatMapService(object, token);
    operationalTracer.info("postMultiavailability", {
        request: { postSeatMapRequest: object },
        response: { postSeatMapRequest: response },
        statusCode: constants.HTTP_STATUS_OK,
    });

    return res.header("Content-Type", "application/json").send(response);

}
