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
                { tipoelemento: 'SR', codssr: 'DOCS', txtssr: 'TEST', numleg: '1', numpax: '1', ciassr: 'CI', accssr: 'AC', idresrva: 0, numpaxamadeus: 0, comandoamadeus: '' },
                { tipoelemento: 'OS', txtssr: 'OS TEST', idresrva: 0, numpaxamadeus: 0, comandoamadeus: '', codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '' },
                { tipoelemento: 'TK', txtssr: 'OK', idresrva: 0, numpaxamadeus: 0, comandoamadeus: '', codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '' }
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
                { tipoelemento: 'FD', txtssr: 'FD DESCUENTO X1234567A 12345', numpax: '1', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' },
                { tipoelemento: 'FZ', txtssr: 'FZ INFO', numpax: '1', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' }
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
                { tipoelemento: 'AP', txtssr: '987654321', numpax: '1', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' },
                { tipoelemento: 'APE', txtssr: 'email@test.com', numpax: '2', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' }
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
                { tipoelemento: 'RF', txtssr: 'RF TEXT', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' }
            ];
            
            mapRF(ssrData, itlBooking);
            expect(itlBooking.rf).toBe('RF TEXT');
        });

        it('should not add RF if no RF element exists', () => {
            mapRF([], itlBooking);
            expect(itlBooking.rf).toBeUndefined();
        });
    });

    it('should map SSR with different tipoelemento', () => {
        const ssrData: ElementsDB[] = [
            { tipoelemento: 'OS', txtssr: 'Test OS', ciassr: 'CIASSR', idresrva: 0, codssr: '', accssr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'FT', txtssr: 'Test FT', numpax: '1', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'FE', txtssr: 'Test FE', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'RF', txtssr: 'Test RF', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'TK', txtssr: 'OK', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'RM', txtssr: 'Test RM', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'SI', txtssr: 'Test SI', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpax: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'FP', txtssr: 'Test FP', numpax: '1', idresrva: 0, codssr: '', accssr: '', ciassr: '', numleg: '', numpaxamadeus: 0, comandoamadeus: '' },
            { tipoelemento: 'DOCS', txtssr: 'Test DOCS', accssr: 'A', numleg: '1', numpax: '1', ciassr: 'CIASSR', idresrva: 0, codssr: '', numpaxamadeus: 0, comandoamadeus: '' }
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