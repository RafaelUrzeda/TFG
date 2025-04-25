import { getAmadeus } from '../../../src/externals/ITLamadeus.external';
import { Booking } from '../../../src/interfaces/interface.index';
import { processAndAddFlight } from '../../../src/service/llamadasItlAmadeus.service';

jest.mock('../../../src/externals/ITLamadeus.external');

const mockedGetAmadeus = getAmadeus as jest.Mock;

describe('processAndAddFlight', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process a booking successfully when Amadeus returns valid response', async () => {
        const mockedAmadeusResponse = {
            originDestinationDetails: [{
                itineraryInfo: [{
                    travelProduct: {
                        boardpointDetail: { cityCode: 'MAD' },
                        offpointDetail: { cityCode: 'BCN' },
                        product: {
                            depDate: '250425',
                            arrDate: '250425',
                            depTime: '1200',
                            arrTime: '1330'
                        },
                        productDetails: {
                            identification: '1234'
                        }
                    },
                    elementManagementItinerary: {
                        reference: { number: 'ABC123' }
                    },
                    relatedProduct: {
                        status: ['HK']
                    },
                    errorInfo: {
                        errorWarningDescription: {
                            freeText: ''
                        }
                    }
                }]
            }]
        };

        mockedGetAmadeus.mockResolvedValue(mockedAmadeusResponse);

        const booking: Booking = {
            idReserva: '1',
            flights: [{
                id: 'f1',
                idReserva: '1',
                seqser: 1,
                airportCodeOrigin: 'MAD',
                airportCodeDestination: 'BCN',
                departureDate: '250425',
                flightNumber: '1234',
                cabinClass: 'Y',
                companyId: 'IB',
                statusCode: 'OK',
                ticketsNumber: 1,
                llamadaGyms: 'NO',
                codigoBloqueo: [{ codigoBloqueo: 'HK' }],
                reservarAsientos: 'NO'
            }]
        };

        const result = await processAndAddFlight(booking);

        expect(result.allOkInBookingProcess).toBe(true);
        expect(result.itlBooking.flights?.[0].amadeusId).toBe('ABC123');
    });

    it('should return processFail if Amadeus response includes error', async () => {
        const mockedAmadeusResponse = {
            originDestinationDetails: [{
                itineraryInfo: [{
                    travelProduct: {
                        boardpointDetail: { cityCode: 'MAD' },
                        offpointDetail: { cityCode: 'BCN' },
                        product: {
                            depDate: '250425',
                            arrDate: '250425',
                            depTime: '1200',
                            arrTime: '1330'
                        },
                        productDetails: {
                            identification: '1234'
                        }
                    },
                    elementManagementItinerary: {
                        reference: { number: 'ABC123' }
                    },
                    relatedProduct: {
                        status: ['HK']
                    },
                    errorInfo: {
                        errorWarningDescription: {
                            freeText: 'ERROR FOUND'
                        }
                    }
                }]
            }]
        };

        mockedGetAmadeus.mockResolvedValue(mockedAmadeusResponse);

        const booking: Booking = {
            idReserva: '2',
            flights: [{
                id: 'f2',
                idReserva: '2',
                seqser: 2,
                airportCodeOrigin: 'MAD',
                airportCodeDestination: 'BCN',
                departureDate: '250425',
                flightNumber: '1234',
                cabinClass: 'Y',
                companyId: 'IB',
                statusCode: 'OK',
                ticketsNumber: 1,
                llamadaGyms: 'NO',
                codigoBloqueo: [{ codigoBloqueo: 'HK' }],
                reservarAsientos: 'NO'
            }]
        };

        const result = await processAndAddFlight(booking);

        expect(result.allOkInBookingProcess).toBe(false);
    });
});
