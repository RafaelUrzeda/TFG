import { FastifyReply } from 'fastify';
import { itlUpdateBookingController } from "../../../src/controllers/itlUpdateBooking.controllers";
import { fullItlUpdateBookingService } from "../../../src/service/itlUpdateBooking.service";

jest.mock("../../../src/service/itlUpdateBooking.service");

describe('itlBookingController', () => {

    const mockRequest = {
        body: {
            idReserva: '123',
            localizador: 'test-localizador',
        },
        headers: {
            authorization: 'test-token',
        },
    };

    const mockResponse = {
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    it('calls itlBookingService.fullItlBookingService with correct idReserva', async () => {
        // eslint-disable-next-line
        await itlUpdateBookingController(mockRequest as any, mockResponse as unknown as FastifyReply);

        expect(fullItlUpdateBookingService).toHaveBeenCalledWith('123', 'test-token', 'test-localizador');
    });

    it('calls response.header and response.send with correct parameters', async () => {

        await fullItlUpdateBookingService(Number(mockRequest.body.idReserva), mockRequest.headers.authorization, mockRequest.body.localizador);

        expect(mockResponse.header).toHaveBeenCalledWith('Content-Type', 'application/json');

        expect(mockResponse.send).toHaveBeenCalled();
    });
});
