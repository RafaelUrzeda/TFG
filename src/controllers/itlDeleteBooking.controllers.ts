import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { deleteBooking } from "../interfaces/deleteBooking.interface";
import { itlDeleteBookingService } from "../service/itlDeleteBooking.service";
import { authorizationValidate } from "../validations/authorization.validations";

const itlDeleteBooking = async (
    req: FastifyRequest<{ Body: deleteBooking, Headers: { Authorization?: string }  }>,
    res: FastifyReply,
) => {
    const { locata, xsid } = req.body;
    const token: string = req.headers.authorization || "";
    authorizationValidate(token, xsid);
    const response = await itlDeleteBookingService( locata, token );
    operationalTracer.info("booking", {
        request: { booking: { locata } },
        response: { description: response },
        statusCode: constants.HTTP_STATUS_OK,
    });

    return res.header("Content-Type", "application/json").send(response);
}

export { itlDeleteBooking };

