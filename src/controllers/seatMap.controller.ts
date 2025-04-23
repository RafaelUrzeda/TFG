import { FastifyReply, FastifyRequest } from "fastify";
import { SeatMapRequest } from "../interfaces/interface.index";
import { getSeatMapService } from "../service/seatMap.service";

export const seatMapController = async (
    req: FastifyRequest<{ Body: SeatMapRequest, Headers: { Authorization?: string } }>,
    res: FastifyReply,
) => {
    const object: SeatMapRequest = req.body;
    const token = req.headers.authorization || "";
    const response = await getSeatMapService(object, token);


    return res.header("Content-Type", "application/json").send(response);

}
