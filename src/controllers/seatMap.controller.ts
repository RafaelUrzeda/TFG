import { FastifyReply, FastifyRequest } from "fastify";
import { SeatMapRequest } from "../interfaces/interface.index";
import { getSeatMapService } from "../service/seatMap.service";

export const seatMapController = async (
    req: FastifyRequest<{ Body: SeatMapRequest }>,
    res: FastifyReply,
) => {
    const object: SeatMapRequest = req.body;
    const idFlight = req.body.idReserva || '0';
    const response = await getSeatMapService(object, idFlight);


    return res.header("Content-Type", "application/json").send(response);

}
