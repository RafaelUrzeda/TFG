import { getAmadeusPNR } from '../externals/pnrAmadeus.external';

const itlGetPnrService = async (locata: string, token: string) => {
        
    const response = await getAmadeusPNR(locata, token);

    return response.data;
}

export { itlGetPnrService };
