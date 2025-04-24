import { getAmadeusPNR } from '../externals/pnrAmadeus.external';

const itlGetPnrService = async (locata: string) => {
        
    const response = await getAmadeusPNR(locata);

    return response.data;
}

export { itlGetPnrService };

