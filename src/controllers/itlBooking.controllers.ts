import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { ITLBooking } from "../interfaces/itlBooking.interface";
import { fullItlBookingService } from "../service/itlBooking.service";

const itlBookingController = async (
    req: FastifyRequest<{ Body: ITLBooking; Headers: { Authorization?: string } }>,
    res: FastifyReply
) => {
    const { idReserva: idBooking } = req.body;
    const response = await fullItlBookingService(idBooking);
    operationalTracer.info("booking", {
        request: { booking: { idReserva: idBooking } },
        response: { description: response },
        statusCode: constants.HTTP_STATUS_OK,
    });

    return res.header("Content-Type", "application/json").send(response);
}

export { itlBookingController };
