import { cancelPNR } from '../externals/adeleteAmadeus.external';
import { postFinishSessionAma } from '../externals/finishSessionAma.external';
import { getAmadeusPNR } from '../externals/pnrAmadeus.external';
import { deletePnrElements } from '../interfaces/interface.index';


const itlDeleteBookingService = async (locata: string, token: string) => {
    
    const { headers } = await getAmadeusPNR(locata, token);
    const amadeusSession =  headers.amadeussession;
    const data: deletePnrElements = {
        actionCode: 11,
        cancelType: "I",
        cancelElements: []
    };

    await cancelPNR(data, amadeusSession, token);
    await postFinishSessionAma(token, amadeusSession || '');

    return "Canceled";
};

export { itlDeleteBookingService };
