import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import { itlGetPnrService } from '../../../src/service/itlGetPnr.service';

jest.mock('../../../src/externals/pnrAmadeus.external');

describe('itlGetPnrService', () => {
    const locata = 'test-locata';
    const token = 'test-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch PNR data successfully', async () => {
        const mockResponse = { data: { pnrHeader: [{ reservationInfo: { reservation: [{ controlNumber: 'ABC123' }] } }] } };

        (getAmadeusPNR as jest.Mock).mockResolvedValue(mockResponse);

        const result = await itlGetPnrService(locata);

        expect(getAmadeusPNR).toHaveBeenCalledWith(locata);
        expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors gracefully', async () => {
        (getAmadeusPNR as jest.Mock).mockRejectedValue(new Error('Failed to fetch PNR'));

        await expect(itlGetPnrService(locata)).rejects.toThrow('Failed to fetch PNR');
        expect(getAmadeusPNR).toHaveBeenCalledWith(locata);
    });
});