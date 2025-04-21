import { getCodigosAmadeus, itlElements, itlPasajeros, itlReservas, itlVuelos, updateSolicitudesVuelo } from '../../../src/database/infoSol.database';
import { Booking, BookingData, ElementsDB, FlightDB, PaxesDB } from '../../../src/interfaces/interface.index';
import { dataBooking, dataFlight, dataPaxes, dataSsr, updateTables } from '../../../src/service/database.service';
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
        SEQPAX: '1',
        NPAX: 1,
        NOMBRE: 'John',
        APELLIDO1: 'Doe',
        APELLIDO2: 'Smith',
        TRATAMIENTO: 'Mr',
        TIPOPASAJERO: 'Adult',
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
        DOCUMENTO: '',
        FORMAPAGO: '',
        CANDIDATORESIDENTE: '',
        IDRESRVA: 0
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
        IDRESRVA: mockIdReservas,
        TIPOELEMENTO: 'tipoElemento',
        CODSSR: 'coddataSsr',
        ACCSSR: 'accdataSsr',
        CIASSR: 'ciasdataSsr',
        TXTSSR: 'txtdataSsr',
        NUMLEG: 'numLeg',
        NUMPAX: 'numPax',
        NUMPAXAMADEUS: 1,
        COMANDOAMADEUS: 'comandoAmadeus'
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
        SEQSER: 'sequence',
        NVUELO: 'flightNumber',
        CIAAEREA: 'airline',
        NUMFLT: 'flightNumber',
        CLASE: 'class',
        APTDEP: 'departureAirport',
        APTARR: 'arrivalAirport',
        TIMDEP: 'departureTime',
        PASAJEROS: 2,
        CODIGOBLOQUEO1: 'blockCode1',
        CODIGOBLOQUEO2: 'blockCode2',
        CODIGOBLOQUEO3: 'blockCode3',
        CONSULTARGYMS: 'gymQuery',
        CODIGOBLOQUEOGYMS: 'gymBlockCode',
        MERCADO: 'market',
        RESERVARASIENTOS: 'seatReservation',
        IDRESREVA: 0
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

describe('dataBooking', () => {
    const mockIdReserva = 123;
    const mockDatos: BookingData = {
        IDRESERVA: '123',
        IDSOLICITUD: '',
        NUMEROSOLICITUD: '',
        SERVICIOS: '',
        FECHAPETICION: '',
        ACCION: '',
        LOCATA: '',
        USUATIO: '',
        REVISADO: ''
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return reservation data when itlReservas finds data', async () => {
        (itlReservas as jest.Mock).mockResolvedValue(mockDatos);

        const result = await dataBooking(mockIdReserva);

        expect(itlReservas).toHaveBeenCalledWith(mockIdReserva);
        expect(result).toEqual(mockDatos);
    });

    it('should throw an error when itlReservas does not find data', async () => {
        const mockError = new Error('No se encontraron datos de la reserva');
        (itlReservas as jest.Mock).mockResolvedValue(null);

        await expect(dataBooking(mockIdReserva)).rejects.toThrow(mockError);

        expect(itlReservas).toHaveBeenCalledWith(mockIdReserva);
    });
});

describe('updateTables', () => {
    const mockRoot: Booking = {
        idSolicitud: '1',
        localizador: 'locator',
        flights: [{
            amadeusStatusCode: 'statusCode',
            fullDepartureDate: '2023-01-01T00:00:00Z',
            fullArrivalDate: '2023-01-01T02:00:00Z',
            seqser: 1,
            id: '',
            airportCodeOrigin: '',
            airportCodeDestination: '',
            departureDate: '',
            flightNumber: '',
            cabinClass: '',
            companyId: '',
            statusCode: '',
            ticketsNumber: 0,
            llamadaGyms: '',
            codigoBloqueo: [],
            reservarAsientos: ''
        }]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update flight tables when flights are present', async () => {
        const mockStatusCodes = {
            ESTADOSVC: 'statusSvc',
            CODIGOBLQ: 'blockCode'
        };
        (getCodigosAmadeus as jest.Mock).mockResolvedValue(mockStatusCodes);
        (updateSolicitudesVuelo as jest.Mock).mockResolvedValue(undefined);

        await updateTables(mockRoot);

        expect(updateSolicitudesVuelo)
    });

    it('should not update flight tables when no flights are present', async () => {
        const mockRootNoFlights: Booking = {
            idSolicitud: '1',
            localizador: 'locator',
            flights: []
        };

        await updateTables(mockRootNoFlights);

        expect(getCodigosAmadeus).not.toHaveBeenCalled();
        expect(updateSolicitudesVuelo).not.toHaveBeenCalled();
    });
});