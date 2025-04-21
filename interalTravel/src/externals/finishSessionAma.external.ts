import axios from "axios";
import { constants as httpcodes } from "http2";
import { unvailable } from "../common/errors/serviceUnvailable";

const postFinishSessionAma = async ( amadeusSession: string): Promise<any> => {
    const url = ``;
    const headers = {
        'Content-Type': 'application/json',
        'AmadeusSession': amadeusSession,
    };
    const body = {}

    try {
        const response = await axios.post(
            url,
            body,
            { headers }
        );

        return response.data;
    } catch (error: unknown) {
        throw new unvailable(
            `Service is unvailable`,
            httpcodes.HTTP_STATUS_SERVICE_UNAVAILABLE,
            `Servicio no responde`
        );
    }
}

export { postFinishSessionAma };
