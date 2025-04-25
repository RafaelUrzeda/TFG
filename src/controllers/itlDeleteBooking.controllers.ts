import { FastifyReply, FastifyRequest } from "fastify";
import { deleteBooking } from "../interfaces/deleteBooking.interface";
import { itlDeleteBookingService } from "../service/itlDeleteBooking.service";

const itlDeleteBooking = async (
    req: FastifyRequest<{ Body: deleteBooking}>,
    res: FastifyReply,
) => {
    const { locata, xsid } = req.body;
    const response = await itlDeleteBookingService( locata );

    return res.header("Content-Type", "application/json").send(response);
}

export { itlDeleteBooking };

