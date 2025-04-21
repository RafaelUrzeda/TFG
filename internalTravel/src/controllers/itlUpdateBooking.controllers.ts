import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { itlUpdateBooking } from "../interfaces/interface.index";
import { fullItlUpdateBookingService } from "../service/itlUpdateBooking.service";


const itlUpdateBookingController = async (
	req: FastifyRequest<{ Body: itlUpdateBooking, Headers: { Authorization?: string } }>,
	res: FastifyReply,
) => {
	const { idReserva, localizador, xsid } = req.body;
    const token: string  = req.headers.authorization || "";
	const response = await fullItlUpdateBookingService(idReserva, token, localizador);
	operationalTracer.info("booking", {
		request: { booking: { idReserva } },
		response: { description: response },
		statusCode: constants.HTTP_STATUS_OK,
	});

	return res.header("Content-Type", "application/json").send(response);
}

export { itlUpdateBookingController };

