import { actualizarAmadeusSession, deleteItl_update_reservas_logs, establecerCorrecto, startRegister, updateItl_update_reservas_logs } from '../../../src/database/infoSol.database';
import { postFinishSessionAma } from '../../../src/externals/finishSessionAma.external';
import { getAmadeus } from '../../../src/externals/ITLamadeus.external';
import { getAmadeusPNR } from '../../../src/externals/pnrAmadeus.external';
import * as interfaces from '../../../src/interfaces/interface.index';
import * as itlUpdateBookingService from '../../../src/service/itlUpdateBooking.service';
import { fullItlUpdateBookingService } from '../../../src/service/itlUpdateBooking.service';
import { finishBooking } from '../../../src/service/llamadasItlAmadeus.service';
import { deleteElements } from '../../../src/service/procesaPnr.service';

jest.mock('../../../src/externals/pnrAmadeus.external');
jest.mock('../../../src/database/infoSol.database');
jest.mock('../../../src/externals/finishSessionAma.external');
jest.mock('../../../src/service/procesaPnr.service');
jest.mock('../../../src/service/llamadasItlAmadeus.service');
jest.mock('../../../src/service/database.service');
jest.mock('../../../src/externals/ITLamadeus.external');

describe('fullItlUpdateBookingService', () => {
    const idReserva = 123;
    const token = 'test-token';
    const localizador = 'test-loc';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should complete the booking process successfully', async () => {
        const mockAmaData = {
            pnr: { originDestinationDetails: [{ itineraryInfo: [] }], travellerInfo: [] },
            headers: { amadeussession: 'session123' },
            amadeussession: 'session123',
            token,
            locata: localizador
        };

        const mockBookingData: interfaces.BookingData = {
            IDSOLICITUD: 'solicitud123',
            IDRESERVA: 'reserva123',
            NUMEROSOLICITUD: 'numeroSolicitud123',
            SERVICIOS: '',
            FECHAPETICION: '2023-10-10',
            ACCION: 'accion123',
            LOCATA: 'locata123',
            USUATIO: 'usuatio123',
            REVISADO: 'revisado123'
        };
        const mockPaxes: interfaces.PaxesDB[] = [{
            IDRESRVA: 123,
            SEQPAX: '1',
            NPAX: 1,
            NOMBRE: 'John Doe',
            APELLIDO1: 'Doe',
            DOCUMENTO: 'PASSPORT',
            APELLIDO2: '',
            TRATAMIENTO: '',
            TIPOPASAJERO: '',
            PAXASOC: 0,
            NOMBREAMADEUS: '',
            NPAXAMADEUS: 0,
            SOCIEDAD: '',
            TOURCODE: '',
            STAFF: '',
            EMAIL: '',
            TELEFONO: '',
            NACDOCIDE: '',
            DATNAC: '',
            NACION: '',
            NUMEROPASAPORTE: '',
            FECHACADUCIDADPAS: '',
            POBLACION: '',
            TIPODOCRESIDENTE: '',
            FORMAPAGO: '',
            CANDIDATORESIDENTE: ''
        }];
        const mockElements: interfaces.ElementsDB[] = [{
            TIPOELEMENTO: 'SR',
            IDRESRVA: 0,
            CODSSR: '',
            ACCSSR: '',
            CIASSR: '',
            TXTSSR: '',
            NUMLEG: '',
            NUMPAX: '',
            NUMPAXAMADEUS: 0,
            COMANDOAMADEUS: ''
        }];
        const mockFlight: interfaces.FlightDB[] = [{
            NVUELO: '123',
            IDRESREVA: 0,
            SEQSER: '',
            CIAAEREA: '',
            NUMFLT: '',
            CLASE: '',
            APTDEP: '',
            APTARR: '',
            TIMDEP: '',
            PASAJEROS: 0,
            CODIGOBLOQUEO1: '',
            CODIGOBLOQUEO2: '',
            CODIGOBLOQUEO3: '',
            CONSULTARGYMS: '',
            CODIGOBLOQUEOGYMS: '',
            MERCADO: '',
            RESERVARASIENTOS: ''
        }];

        (getAmadeusPNR as jest.Mock).mockResolvedValue({ data: mockAmaData.pnr, headers: mockAmaData.headers });
        (startRegister as jest.Mock).mockResolvedValue(undefined);
        (actualizarAmadeusSession as jest.Mock).mockResolvedValue(undefined);
        (deleteElements as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });
        (finishBooking as jest.Mock).mockResolvedValue({ data: { pnr: 'PNR123' }, headers: { amadeussession: 'session123' } });
        (postFinishSessionAma as jest.Mock).mockResolvedValue(undefined);
        (deleteItl_update_reservas_logs as jest.Mock).mockResolvedValue(undefined);
        (updateItl_update_reservas_logs as jest.Mock).mockResolvedValue(undefined);
        jest.spyOn(itlUpdateBookingService, 'getDataBaseData').mockResolvedValue([mockBookingData, mockPaxes, mockElements, mockFlight]);
        (getAmadeus as jest.Mock).mockResolvedValue({ headers: { amadeussession: 'session123' } });

        const result = await fullItlUpdateBookingService(idReserva, token, localizador);

        expect(startRegister).toHaveBeenCalledWith(idReserva);
        expect(getAmadeusPNR).toHaveBeenCalledWith(localizador, token);
        expect(actualizarAmadeusSession).toHaveBeenCalledWith(idReserva, 'session123');
        expect(deleteElements).toHaveBeenCalled();
        expect(finishBooking).toHaveBeenCalled();
        expect(establecerCorrecto).toHaveBeenCalled();
        expect(postFinishSessionAma).toHaveBeenCalledWith(token, 'session123');
        expect(deleteItl_update_reservas_logs).toHaveBeenCalledWith(idReserva);
        expect(updateItl_update_reservas_logs).toHaveBeenCalled();
        expect(result).toContain('PNR123');
    });

});
