import { Booking, ElementsDB } from '../../../src/interfaces/interface.index';
import { mapContactInformation, mapResidentDiscount, mapRF, mapSsrToRoot } from '../../../src/mappers/ssr.mapper';

describe('SSR Mapper', () => {
    let itlBooking: Booking;

    beforeEach(() => {
        itlBooking = {} as Booking;
    });

    describe('mapSsrToRoot', () => {
        it('should correctly map SSR elements to the booking object', () => {
            const ssrData: ElementsDB[] = [
                { TIPOELEMENTO: 'SR', CODSSR: 'DOCS', TXTSSR: 'TEST', NUMLEG: '1', NUMPAX: '1', CIASSR: 'CI', ACCSSR: 'AC', IDRESRVA: 0, NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' },
                { TIPOELEMENTO: 'OS', TXTSSR: 'OS TEST', IDRESRVA: 0, NUMPAXAMADEUS: 0, COMANDOAMADEUS: '', CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAX: '' },
                { TIPOELEMENTO: 'TK', TXTSSR: 'OK', IDRESRVA: 0, NUMPAXAMADEUS: 0, COMANDOAMADEUS: '', CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAX: '' }
            ];

            mapSsrToRoot(ssrData, itlBooking);

            expect(itlBooking.ssrs).toEqual([
                {
                    type: 'DOCS',
                    freeText: 'TEST',
                    flightsReference: [{ id: '1' }],
                    paxReference: [{ id: '1' }],
                    companyId: 'CI',
                    status: { type: 'AC' }
                }
            ]);
            expect(itlBooking.osiRemarks).toEqual([{ type: 'OS', freeText: 'OS TEST' }]);
            expect(itlBooking.tkok).toBe(true);
        });

        it('should handle empty SSR array without errors', () => {
            mapSsrToRoot([], itlBooking);
            expect(itlBooking).toEqual({});
        });
    });

    describe('mapResidentDiscount', () => {
        it('should correctly extract resident discount information', () => {
            const ssrData: ElementsDB[] = [
                { TIPOELEMENTO: 'FD', TXTSSR: 'FD DESCUENTO X1234567A 12345', NUMPAX: '1', IDRESRVA: 0, CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' },
                { TIPOELEMENTO: 'FZ', TXTSSR: 'FZ INFO', NUMPAX: '1', IDRESRVA: 0, CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' }
            ];

            mapResidentDiscount(ssrData, itlBooking);
            expect(itlBooking.residentDiscounts).toEqual([
                {
                    discountType: 'DESCUENTO',
                    documentType: 'X1234567A',
                    documentNumber: '',
                    suffixLetter: undefined,
                    prefixLetter: undefined,
                    zipCode: undefined,
                    paxReference: { id: '1' },
                    fzLine: 'NMFZ INFO'
                }
            ]);
        });
    });

    describe('mapContactInformation', () => {
        it('should map contact information correctly', () => {
            const ssrData: ElementsDB[] = [
                { TIPOELEMENTO: 'AP', TXTSSR: '987654321', NUMPAX: '1', IDRESRVA: 0, CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' },
                { TIPOELEMENTO: 'APE', TXTSSR: 'email@test.com', NUMPAX: '2', IDRESRVA: 0, CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' }
            ];
            
            mapContactInformation(ssrData, itlBooking);
            expect(itlBooking.contactInformation).toEqual([
                { telephone: '987654321', paxReference: [{ id: '1' }] },
                { email: 'email@test.com', paxReference: [{ id: '2' }] }
            ]);
        });
    });

    describe('mapRF', () => {
        it('should map RF correctly when present', () => {
            const ssrData: ElementsDB[] = [
                { TIPOELEMENTO: 'RF', TXTSSR: 'RF TEXT', IDRESRVA: 0, CODSSR: '', ACCSSR: '', CIASSR: '', NUMLEG: '', NUMPAX: '', NUMPAXAMADEUS: 0, COMANDOAMADEUS: '' }
            ];
            
            mapRF(ssrData, itlBooking);
            expect(itlBooking.rf).toBe('RF TEXT');
        });

        it('should not add RF if no RF element exists', () => {
            mapRF([], itlBooking);
            expect(itlBooking.rf).toBeUndefined();
        });
    });
    it('should map SSR with different TIPOELEMENTO', () => {
        const ssrData: ElementsDB[] = [
            {
                TIPOELEMENTO: 'OS', TXTSSR: 'Test OS', CIASSR: 'CIASSR',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'FT', TXTSSR: 'Test FT', NUMPAX: '1',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'FE', TXTSSR: 'Test FE',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'RF', TXTSSR: 'Test RF',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'TK', TXTSSR: 'OK',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'RM', TXTSSR: 'Test RM',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'SI', TXTSSR: 'Test SI',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAX: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'FP', TXTSSR: 'Test FP', NUMPAX: '1',
                IDRESRVA: 0,
                CODSSR: '',
                ACCSSR: '',
                CIASSR: '',
                NUMLEG: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
            {
                TIPOELEMENTO: 'DOCS', TXTSSR: 'Test DOCS', ACCSSR: 'A', NUMLEG: '1', NUMPAX: '1', CIASSR: 'CIASSR',
                IDRESRVA: 0,
                CODSSR: '',
                NUMPAXAMADEUS: 0,
                COMANDOAMADEUS: ''
            },
        ];
        mapSsrToRoot(ssrData, itlBooking);
        expect(itlBooking.ssrs).toBeDefined();
        expect(itlBooking.osiRemarks).toBeDefined();
        expect(itlBooking.fareTourCode).toBeDefined();
        expect(itlBooking.fareEndorsementRemarks).toBeDefined();
        expect(itlBooking.tkok).toBeDefined();
        expect(itlBooking.remarks).toBeDefined();
        expect(itlBooking.fops).toBeDefined();
    });
});
