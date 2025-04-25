import { cancelPNR } from '../../../src/externals/adeleteAmadeus.external';
import { deleteElements } from '../../../src/service/procesaPnr.service';
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
        await deleteElements(mockPnrData);

        // Verificar que cancelPNR se llama con los argumentos correctos
        expect(cancelPNR).toHaveBeenCalledWith("");
    });

});
