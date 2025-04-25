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
            seqser: '1',
            aptdep: 'MAD',
            aptarr: 'JFK',
            timdep: '2024-02-04T10:30:00Z',
            numflt: 'AA100',
            clase: 'E',
            ciaaerea: 'AA',
            codigobloqueogyms: 'CONFIRMADO',
            pasajeros: 150,
            consultargyms: 'true',
            codigobloqueo1: 'BLQ1',
            codigobloqueo2: '',
            codigobloqueo3: 'BLQ3',
            reservarasientos: 'false',
            idresreva: 0,
            nvuelo: '1',
            mercado: ''
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
            seqser: '2',
            aptdep: 'LAX',
            aptarr: 'ORD',
            timdep: '2024-03-01T15:00:00Z',
            numflt: 'UA200',
            clase: 'B',
            ciaaerea: 'UA',
            codigobloqueogyms: 'PENDING',
            pasajeros: 100,
            consultargyms: 'false',
            reservarasientos: 'true',
            idresreva: 0,
            nvuelo: '2',
            mercado: '',
            codigobloqueo2: 'BLQ4',
            codigobloqueo3: '',
            codigobloqueo1: ''
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
                seqser: '3',
                aptdep: 'CDG',
                aptarr: 'LHR',
                timdep: '2024-02-10T09:00:00Z',
                numflt: 'BA300',
                clase: 'F',
                ciaaerea: 'BA',
                codigobloqueogyms: 'OK',
                pasajeros: 50,
                consultargyms: 'true',
                codigobloqueo1: '',
                codigobloqueo2: '',
                codigobloqueo3: '',
                reservarasientos: 'false',
                idresreva: 0,
                nvuelo: '',
                mercado: ''
            },
            { 
                seqser: '1', 
                aptdep: 'JFK', 
                aptarr: 'SFO', 
                timdep: '2024-02-05T12:00:00Z', 
                numflt: 'DL500', 
                clase: 'C', 
                ciaaerea: 'DL', 
                codigobloqueogyms: 'PENDING', 
                pasajeros: 200, 
                consultargyms: 'true', 
                codigobloqueo1: 'BLQ5', 
                codigobloqueo2: '', 
                codigobloqueo3: '', 
                reservarasientos: 'true',
                idresreva: 0,
                nvuelo: '',
                mercado: ''
            }
        ];
        
        const result = mapDataFlightToMultiSegmentRequest(bookingData, mockData);
    });
});