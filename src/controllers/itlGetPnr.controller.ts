import { FastifyReply, FastifyRequest } from "fastify";
import { deleteBooking } from "../interfaces/deleteBooking.interface";
import { itlGetPnrService } from "../service/itlGetPnr.service";

const itlGetPnr = async (
    req: FastifyRequest<{ Body: deleteBooking, Headers: { Authorization?: string }  }>,
    res: FastifyReply,
) => {
    const { locata, xsid } = req.body;
    const token: string = req.headers.authorization || "";

    const response = await itlGetPnrService( locata, token );


    return res.header("Content-Type", "application/json").send(response);
}

export { itlGetPnr };

