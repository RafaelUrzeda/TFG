import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import { itlDeleteBookingService } from '../../../src/service/itlDeleteBooking.service';

jest.mock('../../../src/externals/pnrAmadeus.external');
jest.mock('../../../src/externals/adeleteAmadeus.external');

describe('itlDeleteBookingService', () => {
    const locata = '12345';
    const token = 'Bearer token';

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('should return "Canceled"', async () => {
        (getAmadeusPNR as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });

        const result = await itlDeleteBookingService(locata, token);

        expect(result).toBe('DELETED');
    });
});