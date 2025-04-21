import axios, { AxiosError } from "axios";
import conf from "../config/config";

export const postAmadeusCommand = async (command: string, token: string, amadeusSession: string): Promise<any> => {
    const url = conf.externalServices.environmentURL + conf.externalServices.amadeusCryptic.baseURL + conf.externalServices.amadeusCryptic.endpoints.command;
    const headers: { 'Content-Type': string; Authorization: string; amadeusSession?: string; amadeusofficeid?: string; amadeusdutycode?: string } = {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
        'amadeusSession': `${amadeusSession}`
    };
    const object = {
        "command": command
    };

    try {
        const response = (await axios.post(
            url,
            object,
            { headers }
        ));
        return response;
    } catch (error: unknown) {
        const errorAux = error as AxiosError;
    }
};