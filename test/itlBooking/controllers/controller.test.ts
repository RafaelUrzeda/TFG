import { FastifyReply } from 'fastify';
import { itlBookingController } from '../../../src/controllers/itlBooking.controllers';
import { fullItlBookingService } from '../../../src/service/itlBooking.service'; // Asegúrate de que esta ruta sea correcta

jest.mock('../../../src/service/itlBooking.service');
jest.mock('fastify');

describe('itlBookingController', () => {

  const mockRequest = {
    body: {
      idReserva: '123',
      origen: 'ms'
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
    await itlBookingController(mockRequest as any, mockResponse as unknown as FastifyReply);

    expect(fullItlBookingService).toHaveBeenCalledWith("123", "test-token", "ms");
  });

  it('calls response.header and response.send with correct parameters', async () => {

    await itlBookingController(mockRequest as any, mockResponse as unknown as FastifyReply);

    expect(mockResponse.header).toHaveBeenCalledWith('Content-Type', 'application/json');

    expect(mockResponse.send).toHaveBeenCalled();
  });
});