import axios from "axios";
import { constants as httpcodes } from "http2";
import { unvailable } from "../common/errors/serviceUnvailable";
import get from '../config/config';
import { deletePnrElements } from "../interfaces/interface.index";

export const cancelPNR = async (data: deletePnrElements, amadeusSession: string, token: string): Promise<any>  => {
    const config = {
        method: 'delete',
        url: `${get.externalServices.environmentURL}${get.externalServices.interlineAmadeusService.baseURL}${get.externalServices.interlineAmadeusService.endpoints.cancel}`, 
        headers: {
            'Content-Type': 'application/json',
            'amadeussession': amadeusSession,
            'Authorization': `${token}`
        },
        data
    };
    try {
        const response = await axios(config);
        return response; 
    } catch (error) {
        throw new unvailable(
            `Service ${get.externalServices.interlineAmadeusService.baseURL} is unvailable`,
            httpcodes.HTTP_STATUS_SERVICE_UNAVAILABLE,
            `Servicio ${get.externalServices.interlineAmadeusService.baseURL} no responde`
        );
    }
};



