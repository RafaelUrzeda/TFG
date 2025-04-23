import { cancelPNR } from '../../../src/externals/adeleteAmadeus.external';
import { PaxesDB } from '../../../src/interfaces/interface.index';
import { deleteElements, deletePassengers } from '../../../src/service/procesaPnr.service';
// Mockear la función cancelPNR
jest.mock('../../../src/externals/adeleteAmadeus.external', () => ({
    cancelPNR: jest.fn(),
}));

describe('deleteElements', () => {
    const mockPnrData = {
        dataElementsMaster: {
            dataElementsIndiv: [
                {
                    elementManagementData: {
                        reference: {
                            qualifier: 'qual1',
                            number: '1',
                        },
                        segmentName: 'SSR',
                    },
                    serviceRequest: {
                        ssr: { type: 'FD' },
                    },
                },
                {
                    elementManagementData: {
                        reference: {
                            qualifier: 'qual2',
                            number: '2',
                        },
                        segmentName: 'SSR',
                    },
                    serviceRequest: {
                        ssr: { type: 'FZ' },
                    },
                },
                {
                    elementManagementData: {
                        reference: {
                            qualifier: 'qual3',
                            number: '3',
                        },
                        segmentName: 'SSR',
                    },
                    serviceRequest: null,
                },
                {
                    elementManagementData: {
                        reference: {
                            qualifier: 'qual4',
                            number: '4',
                        },
                        segmentName: 'OTHER',
                    },
                    serviceRequest: {
                        ssr: { type: 'DOCS' },
                    },
                },
            ],
        },
    };

    const amadeusSession = 'mockSession';
    const token = 'mockToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería filtrar y cancelar los elementos correctos del PNR', async () => {
        await deleteElements(mockPnrData, amadeusSession, token);

        // Verificar que cancelPNR se llama con los argumentos correctos
        expect(cancelPNR).toHaveBeenCalledWith({
            actionCode: 11,
            cancelType: "E",
            cancelElements: [
                { identifier: 'qual1', number: '1' }, // FD
                { identifier: 'qual2', number: '2' }, // FZ
            ],
        }, amadeusSession, token);
    });

});

describe('deletePassengers', () => {
    const mockPnrData = {
        travellerInfo: [
            {
                passengerData: [
                    {
                        travellerInformation: {
                            traveller: { surname: 'DOE' },
                            passenger: [{ firstName: 'JOHN' }],
                        },
                    },
                ],
                elementManagementPassenger: {
                    reference: {
                        qualifier: 'qual1',
                        number: '1',
                    },
                },
            },
            {
                passengerData: [
                    {
                        travellerInformation: {
                            traveller: { surname: 'SMITH' },
                            passenger: [{ firstName: 'JANE' }],
                        },
                    },
                ],
                elementManagementPassenger: {
                    reference: {
                        qualifier: 'qual2',
                        number: '2',
                    },
                },
            },
        ],
    };

    const PaxesDB: PaxesDB[] = [
        { 
            IDRESRVA: 1,
            SEQPAX: '1',
            NPAX: 1,
            TRATAMIENTO: 'Mr',
            NOMBRE: 'JOHN',
            APELLIDO1: 'DOE',
            APELLIDO2: '',
            TIPOPASAJERO: '',
            PAXASOC: 1,
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
        },
    ];
    const amadeusSession = 'mockSession';
    const token = 'mockToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería filtrar y cancelar los pasajeros correctos del PNR', async () => {
        await deletePassengers(mockPnrData, amadeusSession, token, PaxesDB);

        // Verificar que cancelPNR se llama con los argumentos correctos
        expect(cancelPNR).toHaveBeenCalledWith({
            actionCode: 0,
            cancelType: "E",
            cancelElements: [
                { identifier: 'qual2', number: '2' }, // JANE SMITH
            ],
        }, amadeusSession, token);
    });
});
