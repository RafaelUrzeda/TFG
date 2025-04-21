import axios from "axios";
import { constants as httpcodes } from "http2";
import { unvailable } from "../common/errors/serviceUnvailable";
import get from '../config/config';

export const getAmadeusPNR = async (localizador: string, token: string, amadeussession?: string): Promise<any> => {

	if (!localizador || typeof localizador !== 'string') {
		throw new Error("Invalid locator");
	}

	const config = {
		method: 'get',
		url: ``,
		headers: {
			'Content-Type': 'application/json',
			'amadeusofficeid': !amadeussession ? get.amadeusParams.officeId : undefined,
			'amadeusdutycode': !amadeussession ? get.amadeusParams.dutyCode : undefined,
			'amadeussession': amadeussession,
			'Authorization': `${token}`,
		}
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