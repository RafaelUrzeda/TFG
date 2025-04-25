import { FastifyReply, FastifyRequest } from 'fastify';
import { itlBookingController } from '../../../src/controllers/itlBooking.controllers';
import { ITLBooking } from '../../../src/interfaces/itlBooking.interface';
import { fullItlBookingService } from '../../../src/service/itlBooking.service';

jest.mock('../../../src/service/itlBooking.service');

describe('itlBookingController', () => {
  const mockRequest = {
    body: {
      idReserva: '123',
    },
    headers: {
      authorization: 'test-token',
    },
  } as unknown as FastifyRequest<{ Body: ITLBooking; Headers: { Authorization?: string } }>;

  const mockResponse = {
    header: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as FastifyReply;

  it('calls fullItlBookingService with correct idReserva', async () => {
    (fullItlBookingService as jest.Mock).mockResolvedValue({ success: true });

    await itlBookingController(mockRequest, mockResponse);

    expect(fullItlBookingService).toHaveBeenCalledWith('123');
  });

  it('sets the correct response headers and sends the response', async () => {
    const mockServiceResponse = { success: true };
    (fullItlBookingService as jest.Mock).mockResolvedValue(mockServiceResponse);

    await itlBookingController(mockRequest, mockResponse);

    expect(mockResponse.header).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.send).toHaveBeenCalledWith(mockServiceResponse);
  });

  it('handles errors thrown by fullItlBookingService', async () => {
    (fullItlBookingService as jest.Mock).mockRejectedValue(new Error('Service error'));

    await expect(itlBookingController(mockRequest, mockResponse)).rejects.toThrow('Service error');
  });
});