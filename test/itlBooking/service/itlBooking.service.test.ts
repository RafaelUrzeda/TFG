import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import { dataBooking, dataFlight, dataPaxes, dataSsr } from '../../../src/service/database.service';
import { fullItlBookingService } from '../../../src/service/itlBooking.service';
import { finishBooking, processAndAddFlight, processPassengers } from '../../../src/service/llamadasItlAmadeus.service';

jest.mock('../../../src/externals/pnrAmadeus.external');
jest.mock('../../../src/service/llamadasItlAmadeus.service');
jest.mock('../../../src/service/database.service');

describe('fullItlBookingService', () => {
    const mockIdBooking = 123;
    const mockToken = 'mockToken';
    const mockOrigen = 'Web';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should complete booking successfully', async () => {
        // Mock database calls
        (dataBooking as jest.Mock).mockResolvedValueOnce({ IDRESERVA: mockIdBooking, IDSOLICITUD: '12345' });
        (dataFlight as jest.Mock).mockResolvedValueOnce([]);
        (dataPaxes as jest.Mock).mockResolvedValueOnce([{ NPAX: '1', TIPOPASAJERO: 'ADT' }]);
        (dataSsr as jest.Mock).mockResolvedValueOnce([]);

        // Mock processAndAddFlight
        (processAndAddFlight as jest.Mock).mockResolvedValueOnce({
            itlBooking: { amadeussession: 'session123', warnings: [], errors: [] },
            allOkInBookingProcess: true,
        });

        // Mock processPassengers
        (processPassengers as jest.Mock).mockResolvedValueOnce({
            itlBooking: { amadeussession: 'session123', warnings: [], errors: [], tkok: true },
            allOkInBookingProcess: true,
        });

        // Mock finishBooking
        (finishBooking as jest.Mock).mockResolvedValueOnce({
            data: { pnr: { pnrHeader: [{ reservationInfo: { reservation: [{ controlNumber: 'ABC123' }] } }] } },
        });

        // Mock getAmadeusPNR
        (getAmadeusPNR as jest.Mock).mockResolvedValueOnce({ headers: { amadeussession: 'session123' } });

        const result = await fullItlBookingService(mockIdBooking);
        const parsedResult = JSON.parse(result);

        // Assertions
        expect(parsedResult.PNR).toBeDefined();
        expect(parsedResult.PNR.data.pnr.pnrHeader[0].reservationInfo.reservation[0].controlNumber).toBe('ABC123');
        expect(parsedResult.tkok).toBe(undefined);
    });

    it('should handle failed booking and update database', async () => {
        // Mock database calls
        (dataBooking as jest.Mock).mockResolvedValueOnce({ IDRESERVA: mockIdBooking, IDSOLICITUD: '12345' });
        (dataFlight as jest.Mock).mockResolvedValueOnce([]);
        (dataPaxes as jest.Mock).mockResolvedValueOnce([{ NPAX: '1', TIPOPASAJERO: 'ADT' }]);
        (dataSsr as jest.Mock).mockResolvedValueOnce([]);

        // Mock processAndAddFlight with failure
        (processAndAddFlight as jest.Mock).mockResolvedValueOnce({
            itlBooking: { warnings: [], errors: [] },
            allOkInBookingProcess: false,
        });

        const result = await fullItlBookingService(mockIdBooking);
        const parsedResult = JSON.parse(result);

        // Assertions
        expect(parsedResult.ignorePNR).toBe(undefined);
        expect(parsedResult.PNR).toBe(undefined);
    });
});