import { cancelPNR } from '../../../src/externals/adeleteAmadeus.external';
import { postFinishSessionAma } from '../../../src/externals/finishSessionAma.external';
import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import { itlDeleteBookingService } from '../../../src/service/itlDeleteBooking.service';

jest.mock('../../../src/externals/pnrAmadeus.external');
jest.mock('../../../src/externals/adeleteAmadeus.external');
jest.mock('../../../src/externals/finishSessionAma.external');

describe('itlDeleteBookingService', () => {
    const locata = '12345';
    const token = 'Bearer token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call getAmadeusPNR with correct parameters', async () => {
        (getAmadeusPNR as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });

        await itlDeleteBookingService(locata, token);

        expect(getAmadeusPNR).toHaveBeenCalledWith(locata, token);
    });

    test('should call cancelPNR with correct parameters', async () => {
        (getAmadeusPNR as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });

        await itlDeleteBookingService(locata, token);

        const expectedData = {
            actionCode: 11,
            cancelType: 'I',
            cancelElements: []
        };

        expect(cancelPNR).toHaveBeenCalledWith(expectedData, 'session123', token);
    });

    test('should return "Canceled"', async () => {
        (getAmadeusPNR as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });
        (postFinishSessionAma as jest.Mock).mockResolvedValue( token);

        const result = await itlDeleteBookingService(locata, token);

        expect(result).toBe('Canceled');
    });
});