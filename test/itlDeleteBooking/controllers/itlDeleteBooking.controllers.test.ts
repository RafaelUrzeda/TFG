import { FastifyReply, FastifyRequest } from 'fastify';
import { deleteBooking } from '../../../src//interfaces/deleteBooking.interface';
import { itlDeleteBookingService } from '../../../src//service/itlDeleteBooking.service';
import { itlDeleteBooking } from '../../../src/controllers/itlDeleteBooking.controllers';

jest.mock('../../../src//service/itlDeleteBooking.service');

describe('itlDeleteBooking Controller', () => {
    let req: FastifyRequest<{ Body: deleteBooking, Headers: { 'Authorization': string } }>;
    let res: FastifyReply;

    beforeEach(() => {
        req = {
            body: {
                locata: '12345'
            },
            headers: {
                authorization: 'Bearer token'
            }
        } as unknown as FastifyRequest<{ Body: deleteBooking, Headers: { 'Authorization': string } }>;

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            header: jest.fn().mockReturnThis()
        } as unknown as FastifyReply;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should call itlDeleteBookingService with correct parameters', async () => {
        const mockResponse = { success: true };
        (itlDeleteBookingService as jest.Mock).mockResolvedValue(mockResponse);

        await itlDeleteBooking(req, res);

        expect(itlDeleteBookingService).toHaveBeenCalledWith('12345');
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.send).toHaveBeenCalledWith(mockResponse);
    });

    test('should log information with operationalTracer', async () => {
        const mockResponse = { success: true };
        (itlDeleteBookingService as jest.Mock).mockResolvedValue(mockResponse);

        await itlDeleteBooking(req, res);
    });

    test('should return the correct response', async () => {
        const mockResponse = { success: true };
        (itlDeleteBookingService as jest.Mock).mockResolvedValue(mockResponse);

        const result = await itlDeleteBooking(req, res);

        expect(result).toEqual(res);
        expect(res.header).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(res.send).toHaveBeenCalledWith(mockResponse);
    });
});