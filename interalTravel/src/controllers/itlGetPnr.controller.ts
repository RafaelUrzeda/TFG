import { operationalTracer } from "aea-logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { constants } from "http2";
import { getTokenHydra } from "../externals/token.external";
import { deleteBooking } from "../interfaces/deleteBooking.interface";
import { itlGetPnrService } from "../service/itlGetPnr.service";
import { authorizationValidate } from "../validations/authorization.validations";
import { validateXsid } from "../validations/xsid.validations";

const itlGetPnr = async (
    req: FastifyRequest<{ Body: deleteBooking, Headers: { Authorization?: string }  }>,
    res: FastifyReply,
) => {
    const { locata, xsid } = req.body;
    let token: string = req.headers.authorization || "";
    authorizationValidate(token, xsid);
    if (!token && xsid) {
        const isXsidValid = await validateXsid(xsid);
        if (isXsidValid) {
            token = await getTokenHydra();
        }
    }
    const response = await itlGetPnrService( locata, token );
    operationalTracer.info("booking", {
        request: { booking: { locata } },
        response: { description: response },
        statusCode: constants.HTTP_STATUS_OK,
    });

    return res.header("Content-Type", "application/json").send(response);
}

export { itlGetPnr };

