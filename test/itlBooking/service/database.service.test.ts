import { itlElements, itlPasajeros, itlVuelos } from '../../../src/database/infoSol.database';
import { ElementsDB, FlightDB, PaxesDB } from '../../../src/interfaces/interface.index';
import { dataFlight, dataPaxes, dataSsr } from '../../../src/service/database.service';
import { notFoundElement } from '../../../src/validations/elementos.validations';
import { notFoundPax } from '../../../src/validations/pasajeros.validation';
import { notFoundFlight } from '../../../src/validations/vuelos.validations';

jest.mock('../../../src/database/infoSol.database');
jest.mock('../../../src/validations/elementos.validations');
jest.mock('../../../src/validations/pasajeros.validation');
jest.mock('../../../src/validations/vuelos.validations');

describe('Pasajeros', () => {
    const mockIdReservas = 123;
    const mockDatos: PaxesDB[] = [{
        seqpax: '1',
        npax: 1,
        nombre: 'John',
        apellido1: 'Doe',
        apellido2: 'Smith',
        tratamiento: 'Mr',
        tipopasajero: 'Adult',
        paxasoc: 0,
        nombreamadeus: '',
        npaxamadeus: 0,
        sociedad: '',
        tourcode: '',
        staff: '',
        email: '',
        telefono: '',
        nacdocide: '',
        datnac: '',
        nacion: '',
        numeropasaporte: '',
        fechacaducidadpas: '',
        poblacion: '',
        tipodocresidente: '',
        documento: '',
        formapago: '',
        candidatoresidente: '',
        idreserva: 0
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return passenger data when itlPasajeros finds data', async () => {
        (itlPasajeros as jest.Mock).mockResolvedValue(mockDatos);
        (notFoundPax as jest.Mock).mockImplementation(() => {});

        const result = await dataPaxes(mockIdReservas);

        expect(itlPasajeros).toHaveBeenCalledWith(mockIdReservas);
        expect(notFoundPax).toHaveBeenCalledWith(mockDatos);
        expect(result).toEqual(mockDatos);
    });

    it('should throw an error when itlPasajeros does not find data', async () => {
        const mockError = new Error('Passenger not found');
        (itlPasajeros as jest.Mock).mockResolvedValue([]);
        (notFoundPax as jest.Mock).mockImplementation(() => {
            throw mockError;
        });

        await expect(dataPaxes(mockIdReservas)).rejects.toThrow(mockError);

        expect(itlPasajeros).toHaveBeenCalledWith(mockIdReservas);
        expect(notFoundPax).toHaveBeenCalledWith([]);
    });
});

describe('dataSsr', () => {
    const mockIdReservas = 123;
    const mockDatos: ElementsDB[] = [{
        idresrva: mockIdReservas,
        tipoelemento: 'tipoElemento',
        codssr: 'coddataSsr',
        accssr: 'accdataSsr',
        ciassr: 'ciasdataSsr',
        txtssr: 'txtdataSsr',
        numleg: 'numLeg',
        numpax: 'numPax',
        numpaxamadeus: 1,
        comandoamadeus: 'comandoAmadeus'
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return element data when itlElements finds data', async () => {
        (itlElements as jest.Mock).mockResolvedValue(mockDatos);
        (notFoundElement as jest.Mock).mockImplementation(() => {});

        const result = await dataSsr(mockIdReservas);

        expect(itlElements).toHaveBeenCalledWith(mockIdReservas);
        expect(notFoundElement).toHaveBeenCalledWith(mockDatos);
        expect(result).toEqual(mockDatos);
    });

    it('should throw an error when itlElements does not find data', async () => {
        const mockError = new Error('Element not found');
        (itlElements as jest.Mock).mockResolvedValue([]);
        (notFoundElement as jest.Mock).mockImplementation(() => {
            throw mockError;
        });

        await expect(dataSsr(mockIdReservas)).rejects.toThrow(mockError);

        expect(itlElements).toHaveBeenCalledWith(mockIdReservas);
        expect(notFoundElement).toHaveBeenCalledWith([]);
    });
});

describe('dataFlight', () => {
    const mockIdReserva = 123;
    const mockDatos: FlightDB[] = [{
        seqser: 'sequence',
        nvuelo: 'flightNumber',
        ciaaerea: 'airline',
        numflt: 'flightNumber',
        clase: 'class',
        aptdep: 'departureAirport',
        aptarr: 'arrivalAirport',
        timdep: 'departureTime',
        pasajeros: 2,
        codigobloqueo1: 'blockCode1',
        codigobloqueo2: 'blockCode2',
        codigobloqueo3: 'blockCode3',
        consultargyms: 'gymQuery',
        codigobloqueogyms: 'gymBlockCode',
        mercado: 'market',
        reservarasientos: 'seatReservation',
        idresreva: 0
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return flight data when itlVuelos finds data', async () => {
        (itlVuelos as jest.Mock).mockResolvedValue(mockDatos);
        (notFoundFlight as jest.Mock).mockImplementation(() => {});

        const result = await dataFlight(mockIdReserva);

        expect(itlVuelos).toHaveBeenCalledWith(mockIdReserva);
        expect(notFoundFlight).toHaveBeenCalledWith(mockDatos);
        expect(result).toEqual(mockDatos);
    });

    it('should throw an error when itlVuelos does not find data', async () => {
        const mockError = new Error('Flight not found');
        (itlVuelos as jest.Mock).mockResolvedValue([]);
        (notFoundFlight as jest.Mock).mockImplementation(() => {
            throw mockError;
        });

        await expect(dataFlight(mockIdReserva)).rejects.toThrow(mockError);

        expect(itlVuelos).toHaveBeenCalledWith(mockIdReserva);
        expect(notFoundFlight).toHaveBeenCalledWith([]);
    });
});
