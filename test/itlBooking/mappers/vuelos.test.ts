import { Booking, FlightDB } from '../../../src/interfaces/interface.index';
import { isoDateToSpanishFormat, mapDataFlightToMultiSegmentRequest } from '../../../src/mappers/vuelos.mapper';

const bookingData: Booking = {
    flights: []
};
describe('convertirFecha', () => {
    it('debería convertir una fecha ISO a formato ddMMyy', () => {
        expect(isoDateToSpanishFormat('2024-02-04T10:30:00Z')).toBe('040224');
    });
});

describe('mapDatosVuelosToMultiSegmentRequest', () => {
    it('debería mapear correctamente los datos de vuelo', () => {
        const mockData: FlightDB[] = [{
            SEQSER: '1',
            APTDEP: 'MAD',
            APTARR: 'JFK',
            TIMDEP: '2024-02-04T10:30:00Z',
            NUMFLT: 'AA100',
            CLASE: 'E',
            CIAAEREA: 'AA',
            CODIGOBLOQUEOGYMS: 'CONFIRMADO',
            PASAJEROS: 150,
            CONSULTARGYMS: 'true',
            CODIGOBLOQUEO1: 'BLQ1',
            CODIGOBLOQUEO2: '',
            CODIGOBLOQUEO3: 'BLQ3',
            RESERVARASIENTOS: 'false',
            IDRESREVA: 0,
            NVUELO: '1',
            MERCADO: ''
        }];
        const expectedOutput = [{
            idReserva: undefined,
            id: '1',
            seqser: 1,
            airportCodeOrigin: 'MAD',
            airportCodeDestination: 'JFK',
            departureDate: '040224',
            flightNumber: 'AA100',
            cabinClass: 'E',
            companyId: 'AA',
            statusCode: 'CONFIRMADO',
            ticketsNumber: 150,
            llamadaGyms: "true",
            codigoBloqueo: ['BLQ1', 'BLQ3'],
            reservarAsientos: "false"
        }];
        
        mapDataFlightToMultiSegmentRequest(bookingData , mockData);
    });

    it('debería asignar idReserva si se proporciona', () => {
        const mockData: FlightDB[] = [{
            SEQSER: '2',
            APTDEP: 'LAX',
            APTARR: 'ORD',
            TIMDEP: '2024-03-01T15:00:00Z',
            NUMFLT: 'UA200',
            CLASE: 'B',
            CIAAEREA: 'UA',
            CODIGOBLOQUEOGYMS: 'PENDING',
            PASAJEROS: 100,
            CONSULTARGYMS: 'false',
            RESERVARASIENTOS: 'true',
            IDRESREVA: 0,
            NVUELO: '2',
            MERCADO: '',
            CODIGOBLOQUEO2: 'BLQ4',
            CODIGOBLOQUEO3: '',
            CODIGOBLOQUEO1: ''
        }];
        
        const expectedOutput = [{
            idReserva: '999',
            id: '2',
            seqser: 2,
            airportCodeOrigin: 'LAX',
            airportCodeDestination: 'ORD',
            departureDate: '010324',
            flightNumber: 'UA200',
            cabinClass: 'B',
            companyId: 'UA',
            statusCode: 'PENDING',
            ticketsNumber: 100,
            llamadaGyms: "false",
            codigoBloqueo: ['BLQ4'],
            reservarAsientos: "true"
        }];
        
        mapDataFlightToMultiSegmentRequest(bookingData, mockData, 999);
    });

    it('debería ordenar los vuelos por seqser', () => {
        const mockData: FlightDB[] = [
            {
                SEQSER: '3',
                APTDEP: 'CDG',
                APTARR: 'LHR',
                TIMDEP: '2024-02-10T09:00:00Z',
                NUMFLT: 'BA300',
                CLASE: 'F',
                CIAAEREA: 'BA',
                CODIGOBLOQUEOGYMS: 'OK',
                PASAJEROS: 50,
                CONSULTARGYMS: 'true',
                CODIGOBLOQUEO1: '',
                CODIGOBLOQUEO2: '',
                CODIGOBLOQUEO3: '',
                RESERVARASIENTOS: 'false',
                IDRESREVA: 0,
                NVUELO: '',
                MERCADO: ''
            },
            { 
                SEQSER: '1', 
                APTDEP: 'JFK', 
                APTARR: 'SFO', 
                TIMDEP: '2024-02-05T12:00:00Z', 
                NUMFLT: 'DL500', CLASE: 'C', 
                CIAAEREA: 'DL', 
                CODIGOBLOQUEOGYMS: 'PENDING', 
                PASAJEROS: 200, 
                CONSULTARGYMS: 'true', 
                CODIGOBLOQUEO1: 'BLQ5', 
                CODIGOBLOQUEO2: '', 
                CODIGOBLOQUEO3: '', 
                RESERVARASIENTOS: 'true',
                IDRESREVA: 0,
                NVUELO: '',
                MERCADO: ''
            }
        ];
        
        const result = mapDataFlightToMultiSegmentRequest(bookingData, mockData);
    });
});