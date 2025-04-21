import { constants as httpcodes } from "http2";
import { authorization } from "../common/errors/authorization";
import { postSTSCheck } from "../externals/sts.external";

export const validateXsid = async (xsid: string): Promise<boolean> => {
    const sts = await postSTSCheck(xsid);
    if (sts.success === true) {
        return true;
    }
    throw new authorization(
        'Authorization Error',
        httpcodes.HTTP_STATUS_UNAUTHORIZED,
        'Invalid XSID'
    );
}