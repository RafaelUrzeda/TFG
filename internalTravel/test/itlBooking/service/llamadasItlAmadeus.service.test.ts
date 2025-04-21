import { Booking } from '../../../src/interfaces/interface.index';
import { processAndAddFlight, processFail, processPassengers } from '../../../src/service/llamadasItlAmadeus.service';

// Mock de las dependencias externas
jest.mock('../../../src/database/interline.oracle.datasource', () => ({
    pool: {
        getConnection: jest.fn().mockResolvedValue({
            execute: jest.fn().mockResolvedValue([{}, {}]),
            release: jest.fn()
        })
    }
}));

jest.mock('../../../src/externals/ITLamadeus.external', () => ({
    getAmadeus: jest.fn().mockResolvedValue({
        data: {
            pnr: {
                originDestinationDetails: [{
                    itineraryInfo: [{
                        travelProduct: {
                            offpointDetail: { cityCode: 'JFK' },
                            boardpointDetail: { cityCode: 'MAD' },
                            product: { depDate: '040224', identification: 'AA100' },
                            productDetails: { identification: 'AA100' }
                        },
                        elementManagementItinerary: { reference: { number: '1' } },
                        relatedProduct: { status: ['CONFIRMADO'] },
                        errorInfo: { errorWarningDescription: { freeText: '' } }
                    }]
                }],
                travellerInfo: [{
                    passengerData: [{
                        travellerInformation: {
                            traveller: { surname: 'Doe' },
                            passenger: [{ firstName: 'John' }]
                        }
                    }],
                    elementManagementPassenger: { reference: { number: '1' } }
                }]
            }
        },
        headers: { amadeussession: 'new-session' }
    }),
    addPassengers: jest.fn().mockResolvedValue({
        data: {
            pnr: {
                travellerInfo: [{
                    passengerData: [{
                        travellerInformation: {
                            traveller: { surname: 'Doe' },
                            passenger: [{ firstName: 'John' }]
                        }
                    }],
                    elementManagementPassenger: { reference: { number: '1' } }
                }]
            }
        },
        headers: { amadeussession: 'new-session' }
    })
}));

describe('Llamadas ITL Amadeus Service Tests', () => {
    test('processAndAddFlight should process and add flight correctly', async () => {
        const itlBooking: Booking = {
            flights: [{
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
                codigoBloqueo: [],
                reservarAsientos: "false"
            }]
        };
        const token = 'test-token';

        const result = await processAndAddFlight(itlBooking, token);

        expect(result.allOkInBookingProcess).toBe(false);
        expect(result.itlBooking.flights?.[0].amadeusErrorCode).toBeDefined();
    });

    test('processFail should handle failure correctly', async () => {
        const itlBooking: Booking = {};
        const token = 'test-token';
        const amadeusSession = 'test-session';

        const result = await processFail(itlBooking, token, amadeusSession);

        expect(result.allOkInBookingProcess).toBe(false);
        expect(result.itlBooking.ignorePNR).toBe(undefined);
    });

    test('processPassengers should process passengers correctly', async () => {
        const itlBooking: Booking = {
            adults: [{
                firstName: 'John', surname: 'Doe',
                id: '',
                hasInfants: false
            }],
            childs: [{
                firstName: 'Jane', surname: 'Doe',
                id: '',
                dateOfBirth: ''
            }]
        };
        const token = 'test-token';
        const amadeusSession = 'test-session';

        const result = await processPassengers(itlBooking, token, amadeusSession);

        expect(result.allOkInBookingProcess).toBe(true);
        expect(itlBooking.adults?.[0].amadeusId).toBeDefined();
        expect(itlBooking.childs?.[0].amadeusId).toEqual(undefined);
    });
});
