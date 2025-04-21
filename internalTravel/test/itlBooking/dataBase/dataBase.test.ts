import { itlElements, itlPasajeros, itlReservas, itlVuelos } from '../../../src/database/infoSol.database';
import { query } from '../../../src/database/interline.oracle.datasource';



// Mock de la función query
jest.mock('../../../src/database/interline.oracle.datasource', () => ({
    query: jest.fn(),
}));

describe('Interline Oracle Datasource functions', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    describe('itlReservas', () => {
        it('should return the first row if a reservation is found', async () => {
            const mockRows = [{ idreserva: 1, data: 'reservation data' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockRows });

            const result = await itlReservas(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual(mockRows[0]);
        });

        it('should return null if no reservation is found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await itlReservas(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toBeNull();
        });
    });

    describe('itlVuelos', () => {
        it('should return all rows for flights if found', async () => {
            const mockRows = [{ idreserva: 1, vuelo: 'flight1' }, { idreserva: 1, vuelo: 'flight2' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockRows });

            const result = await itlVuelos(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual(mockRows);
        });

        it('should return an empty array if no flights are found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await itlVuelos(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual([]);
        });
    });

    describe('itlPasajeros', () => {
        it('should return all rows for passengers if found', async () => {
            const mockRows = [{ idreserva: 1, pasajero: 'passenger1' }, { idreserva: 1, pasajero: 'passenger2' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockRows });

            const result = await itlPasajeros(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual(mockRows);
        });

        it('should return an empty array if no passengers are found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await itlPasajeros(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual([]);
        });
    });

    describe('itlElements', () => {
        it('should return all rows for elements if found', async () => {
            const mockRows = [{ idreserva: 1, element: 'element1' }, { idreserva: 1, element: 'element2' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockRows });

            const result = await itlElements(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual(mockRows);
        });

        it('should return an empty array if no elements are found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await itlElements(1);

            expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
            expect(result).toEqual([]);
        });
    });

});
