import { FastifyReply, FastifyRequest } from "fastify";
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

    return res.header("Content-Type", "application/json").send(response);
}

export { itlDeleteBooking };

