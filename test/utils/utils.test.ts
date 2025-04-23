import { Booking, Flight } from '../../src/interfaces/jsonResponse.interface';
import { countArnk } from '../../src/utils/utils';

describe('contarArnk', () => {
    test('debería retornar 0 si el array está vacío', () => {
        const booking: Booking = {
            flights: []
        };
        const result = countArnk(booking);
        expect(result).toBe(0);
    });

    test('debería retornar 0 si el array tiene un solo vuelo', () => {
        const flight : Flight[] = [
            {
                airportCodeOrigin: 'JFK', airportCodeDestination: 'LAX',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            }
        ];
        const booking: Booking = { flights: flight };
        const result = countArnk(booking);
    });

    test('debería retornar 0 si todos los vuelos son consecutivos', () => {
        const flight: Flight[] = [
            {
                airportCodeOrigin: 'JFK', airportCodeDestination: 'LAX',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'LAX', airportCodeDestination: 'SFO',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'SFO', airportCodeDestination: 'SEA',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            }
        ];
        const booking: Booking = { flights: flight };

        const result = countArnk(booking);
    });

    test('debería retornar el número correcto de ARNKS', () => {
        const flight: Flight[] = [
            {
                airportCodeOrigin: 'JFK', airportCodeDestination: 'LAX',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'SFO', airportCodeDestination: 'SEA',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'SEA', airportCodeDestination: 'ORD',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            }
        ];
        const booking: Booking = { flights: flight };

        const result = countArnk(booking);
    });

    test('debería retornar el número correcto de ARNKS con múltiples ARNKS', () => {
        const flight: Flight[] = [
            {
                airportCodeOrigin: 'JFK', airportCodeDestination: 'LAX',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'SFO', airportCodeDestination: 'SEA',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'ORD', airportCodeDestination: 'MIA',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            },
            {
                airportCodeOrigin: 'MIA', airportCodeDestination: 'ATL',
                id: '',
                seqser: 0,
                departureDate: '',
                flightNumber: '',
                cabinClass: '',
                companyId: '',
                statusCode: '',
                ticketsNumber: 0,
                llamadaGyms: '',
                codigoBloqueo: [],
                reservarAsientos: ''
            }
        ];
        const booking: Booking = { flights: flight };

        const result = countArnk(booking);
    });
});