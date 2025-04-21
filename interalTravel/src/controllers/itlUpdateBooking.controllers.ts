import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { getTokenHydra } from "../externals/token.external";
import { itlUpdateBooking } from "../interfaces/interface.index";
import { fullItlUpdateBookingService } from "../service/itlUpdateBooking.service";
import { authorizationValidate } from "../validations/authorization.validations";
import { validateXsid } from "../validations/xsid.validations";


const itlUpdateBookingController = async (
	req: FastifyRequest<{ Body: itlUpdateBooking, Headers: { Authorization?: string } }>,
	res: FastifyReply,
) => {
	const { idReserva, localizador, xsid } = req.body;
    let token: string  = req.headers.authorization || "";
    authorizationValidate(token, xsid);
    if (!token && xsid) {
        const isXsidValid = await validateXsid(xsid);
        if (isXsidValid) {
            token = await getTokenHydra();
            token = 'Bearer ' + token;
        }
    }
	const response = await fullItlUpdateBookingService(idReserva, token, localizador);
	operationalTracer.info("booking", {
		request: { booking: { idReserva } },
		response: { description: response },
		statusCode: constants.HTTP_STATUS_OK,
	});

	return res.header("Content-Type", "application/json").send(response);
}

export { itlUpdateBookingController };
