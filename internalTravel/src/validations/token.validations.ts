import { TokenHydraServiceError } from "../common/errors/tokenHydraServiceError";

export const tokenHydraServiceException = (
    servicename: string,
    requestObject: unknown,
) => {
    throw new TokenHydraServiceError(servicename, requestObject);
};

