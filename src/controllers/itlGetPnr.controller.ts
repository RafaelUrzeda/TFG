import { FastifyReply, FastifyRequest } from "fastify";
import { deleteBooking } from "../interfaces/deleteBooking.interface";
import { itlGetPnrService } from "../service/itlGetPnr.service";

const itlGetPnr = async (
    req: FastifyRequest<{ Body: deleteBooking }>,
    res: FastifyReply,
) => {
    const { locata } = req.body;

    const response = await itlGetPnrService( locata );


    return res.header("Content-Type", "application/json").send(response);
}

export { itlGetPnr };

