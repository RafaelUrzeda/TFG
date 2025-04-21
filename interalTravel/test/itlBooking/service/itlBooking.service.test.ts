import database from '../../../src/database/infoSol.database';
import { postFinishSessionAma } from '../../../src/externals/finishSessionAma.external';
import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import { dataBooking, dataFlight, dataPaxes, dataSsr } from '../../../src/service/database.service';
import { fullItlBookingService } from '../../../src/service/itlBooking.service';
import { finishBooking, processAndAddFlight, processPassengers } from '../../../src/service/llamadasItlAmadeus.service';

jest.mock('../../../src/database/infoSol.database');
jest.mock('../../../src/externals/finishSessionAma.external');
jest.mock('../../../src/externals/pnrAmadeus.external');
jest.mock('../../../src/service/llamadasItlAmadeus.service');
jest.mock('../../../src/service/asientos.service');
jest.mock('../../../src/service/database.service');

describe('fullItlBookingService', () => {
    const mockIdBooking = 123;
    const mockToken = 'mockToken';
    const mockOrigen = 'Web';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should complete booking successfully', async () => {
        (database.startRegister as jest.Mock).mockResolvedValueOnce(undefined);
        (database.actualizarAmadeusSession as jest.Mock).mockResolvedValueOnce(undefined);
        (database.establecerCorrecto as jest.Mock).mockResolvedValueOnce(undefined);
        (postFinishSessionAma as jest.Mock).mockResolvedValueOnce(undefined);

        (dataBooking as jest.Mock).mockResolvedValueOnce({ IDRESERVA: mockIdBooking, IDSOLICITUD: '12345' });
        (dataFlight as jest.Mock).mockResolvedValueOnce([]);
        (dataPaxes as jest.Mock).mockResolvedValueOnce([{ NPAX: '1', TIPOPASAJERO: 'ADT' }]);
        (dataSsr as jest.Mock).mockResolvedValueOnce([]);

        (processAndAddFlight as jest.Mock).mockResolvedValueOnce({
            itlBooking: { amadeussession: 'session123', warnings: [], errors: [] },
            amadeusSession: 'session123',
            allOkInBookingProcess: true,
        });

        (processPassengers as jest.Mock).mockResolvedValueOnce({
            itlBooking: { amadeussession: 'session123', warnings: [], errors: [], tkok: true },
            allOkInBookingProcess: true,
            newAmadeusSession: '',
        });

        (finishBooking as jest.Mock).mockResolvedValueOnce({
            data: { pnr: { pnrHeader: [{ reservationInfo: { reservation: [{ controlNumber: 'ABC123' }] } }] } }
        });

        (getAmadeusPNR as jest.Mock).mockResolvedValueOnce({ headers: { amadeussession: 'session123' } });

        const result = await fullItlBookingService(mockIdBooking, mockToken, mockOrigen);
        const parsedResult = JSON.parse(result);
        expect(parsedResult.localizador).toBe('ABC123');
        expect(database.establecerCorrecto).toHaveBeenCalled();
    });

    it('should handle failed booking and update database', async () => {
        (database.startRegister as jest.Mock).mockResolvedValueOnce(undefined);
        (database.actualizarAmadeusSession as jest.Mock).mockResolvedValueOnce(undefined);
        (database.establecerIncorrecto as jest.Mock).mockResolvedValueOnce(undefined);
        (postFinishSessionAma as jest.Mock).mockResolvedValueOnce(undefined);

        (dataBooking as jest.Mock).mockResolvedValueOnce({ IDRESERVA: mockIdBooking, IDSOLICITUD: '12345' });
        (dataFlight as jest.Mock).mockResolvedValueOnce([]);
        (dataPaxes as jest.Mock).mockResolvedValueOnce([{ NPAX: '1', TIPOPASAJERO: 'ADT' }]);
        (dataSsr as jest.Mock).mockResolvedValueOnce([]);

        (processAndAddFlight as jest.Mock).mockResolvedValueOnce({
            itlBooking: { warnings: [], errors: [] },
            amadeusSession: 'session123',
            allOkInBookingProcess: false,
        });

        const result = await fullItlBookingService(mockIdBooking, mockToken, mockOrigen);
        const parsedResult = JSON.parse(result);
        expect(parsedResult.ignorePNR).toBe(undefined);
    });
});

