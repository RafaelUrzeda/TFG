import { FastifyReply, FastifyRequest } from "fastify";
import { ITLBooking } from "../interfaces/itlBooking.interface";
import { fullItlBookingService } from "../service/itlBooking.service";

const itlBookingController = async (
    req: FastifyRequest<{ Body: ITLBooking; Headers: { Authorization?: string } }>,
    res: FastifyReply
) => {
    const { idReserva: idBooking } = req.body;
    const response = await fullItlBookingService(idBooking);

    return res.header("Content-Type", "application/json").send(response);
}

export { itlBookingController };

