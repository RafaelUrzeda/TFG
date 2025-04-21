import { processAndAddFlight } from '../../../src/service/llamadasItlAmadeus.service';

import { getGyms } from '../../../src/externals/gyms.external';
import { getAmadeus } from '../../../src/externals/ITLamadeus.external';
import { Booking, codigosBloqueo, Flight } from '../../../src/interfaces/interface.index';

jest.mock('../../../src/externals/gyms.external');
jest.mock('../../../src/externals/ITLamadeus.external');

describe('processAndAddFlight', () => {
    const token = 'test-token';
    const amadeusSession = 'test-session';

    const mockFlight: Flight = {
        llamadaGyms: 'S',
        codigoBloqueo: ['123' as unknown as codigosBloqueo],
        id: '',
        airportCodeOrigin: 'PMI',
        airportCodeDestination: 'MAD',
        departureDate: '',
        flightNumber: '123',
        cabinClass: '',
        companyId: '',
        statusCode: '',
        ticketsNumber: 0,
        reservarAsientos: '',
        seqser: 0
    };

    const mockRoot: Booking = {
        flights: [mockFlight],
        // otros campos necesarios
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería procesar todos los vuelos correctamente', async () => {
        (getGyms as jest.Mock).mockResolvedValue({ forceIsPossible: 'S' });
        (getAmadeus as jest.Mock).mockResolvedValue({
            data: {
                pnr: {
                    originDestinationDetails: [
                        {
                            itineraryInfo: [
                                {
                                    relatedProduct: { status: ['OK'] },
                                    errorInfo: { errorWarningDescription: { freeText: null } },
                                    elementManagementItinerary: { reference: { number: '123' } },
                                    travelProduct: {
                                        productDetails: {
                                            identification: 123
                                        },
                                        offpointDetail : {
                                            cityCode: 'MAD',
                                        },
                                        boardpointDetail : {
                                            cityCode: 'PMI'
                                        },
                                        product: {
                                            arrDate: '010123',
                                            arrTime: '1200',
                                            depDate: '010123',
                                            depTime: '0800'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            headers: { amadeussession: amadeusSession }
        });

        const result = await processAndAddFlight(mockRoot, token);

        expect(result.allOkInBookingProcess).toBe(false);
        expect(getAmadeus).toHaveBeenCalled();
    });

    it('debería manejar el fallo cuando un vuelo falla', async () => {
        (getGyms as jest.Mock).mockResolvedValue({ forceIsPossible: 'S' });
        (getAmadeus as jest.Mock).mockResolvedValueOnce({
            data: {
                pnr: {
                    originDestinationDetails: [
                        {
                            itineraryInfo: [
                                {
                                    relatedProduct: { status: ['OK'] },
                                    errorInfo: { errorWarningDescription: { freeText: null } },
                                    elementManagementItinerary: { reference: { number: '123' } },
                                    travelProduct: {
                                        productDetails: {
                                            identification: 123
                                        },
                                        offpointDetail : {
                                            cityCode: 'MAD',
                                        },
                                        boardpointDetail : {
                                            cityCode: 'PMI'
                                        },
                                        product: {
                                            arrDate: '010123',
                                            arrTime: '1200',
                                            depDate: '010123',
                                            depTime: '0800'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            headers: { amadeussession: amadeusSession }
        }).mockResolvedValueOnce({
            data: null,
            headers: {}
        });

        const result = await processAndAddFlight(mockRoot, token);

        expect(result.allOkInBookingProcess).toBe(false);
        expect(getAmadeus).toHaveBeenCalled();
    });

    it('debería intentar con códigos de bloqueo cuando llamadaGyms no es "S"', async () => {
        const mockFlightWithoutGyms: Flight = {
            llamadaGyms: 'N',
            codigoBloqueo: ['123' as unknown as codigosBloqueo],
            id: '',
            airportCodeOrigin: 'PMI',
            airportCodeDestination: 'MAD',
            departureDate: '',
            flightNumber: '',
            cabinClass: '',
            companyId: '',
            statusCode: '',
            ticketsNumber: 0,
            reservarAsientos: '',
            seqser: 0
        };

        const mockRootWithoutGyms: Booking = {
            flights: [mockFlightWithoutGyms],
            // otros campos necesarios
        };

        (getAmadeus as jest.Mock).mockResolvedValue({
            
                pnr: {
                    originDestinationDetails: [
                        {
                            itineraryInfo: [
                                {
                                    relatedProduct: { status: ['OK'] },
                                    errorInfo: { errorWarningDescription: { freeText: null } },
                                    elementManagementItinerary: { reference: { number: '123' } },
                                    travelProduct: {
                                        productDetails: {
                                            identification: 123
                                        },
                                        offpontDetail : {
                                            cityCode: 'MAD',
                                        },
                                        boardpointDetail : {
                                            cityCode: 'PMI'
                                        },
                                        product: {
                                            arrDate: '010123',
                                            arrTime: '1200',
                                            depDate: '010123',
                                            depTime: '0800'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ,
            headers: { amadeussession: amadeusSession }
        });

        const result = await processAndAddFlight(mockRootWithoutGyms, token);

        expect(result.allOkInBookingProcess).toBe(false);
        expect(getGyms).not.toHaveBeenCalled();
        expect(getAmadeus).toHaveBeenCalled();
    });
});