import { AxiosError } from "axios";
import { STSServiceError } from "../common/errors/stsServiceError";

export const stsServiceException = (servicename: string, requestObject: unknown, error: AxiosError) => {
    throw new STSServiceError(servicename, requestObject, error.message, error.status);
};
