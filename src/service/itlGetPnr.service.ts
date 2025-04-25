import { getAmadeusPNR } from '../externals/pnrAmadeus.external';

const itlGetPnrService = async (locata: number | string) => {
        
    const response = await getAmadeusPNR(locata);

    return response;
}

export { itlGetPnrService };

