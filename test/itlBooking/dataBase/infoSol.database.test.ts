import { itlVuelos } from '../../../src/database/infoSol.database';
import * as datasource from '../../../src/database/internalTravel.postgre.datasource';

jest.mock('.../../../src/database/internalTravel.postgre.datasource');

describe('itlVuelos', () => {
    const mockExecuteQuery = datasource.executeQuery as jest.Mock;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an empty array when no flights are found', async () => {
        mockExecuteQuery.mockResolvedValueOnce({ rows: [] });

        const result = await itlVuelos(1);

        expect(mockExecuteQuery).toHaveBeenCalledWith({
            text: `
    select * from ITL_RESERVAS_vuelos where idreserva = $1`,
            values: [1],
        });
        expect(result).toEqual([]);
    });

    test('should return an array of flights when flights are found', async () => {
        const mockRows = [
            { id: 1, flightNumber: 'AB123' },
            { id: 2, flightNumber: 'CD456' },
        ];
        mockExecuteQuery.mockResolvedValueOnce({ rows: mockRows });

        const result = await itlVuelos(2);

        expect(mockExecuteQuery).toHaveBeenCalledWith({
            text: `
    select * from ITL_RESERVAS_vuelos where idreserva = $1`,
            values: [2],
        });
        expect(result).toEqual(mockRows);
    });

    test('should throw an error when executeQuery fails', async () => {
        mockExecuteQuery.mockRejectedValueOnce(new Error('Database error'));

        await expect(itlVuelos(3)).rejects.toThrow('Database error');

        expect(mockExecuteQuery).toHaveBeenCalledWith({
            text: `
    select * from ITL_RESERVAS_vuelos where idreserva = $1`,
            values: [3],
        });
    });
});