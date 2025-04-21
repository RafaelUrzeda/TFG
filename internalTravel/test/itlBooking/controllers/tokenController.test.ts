import { operationalTracer } from 'aea-logger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { constants } from 'http2';
import { controllers } from '../../../src/controllers/token.controllers';
import { ITLToken } from '../../../src/interfaces/itlToken.interface';
import { tokenService } from '../../../src/service/token.service';

jest.mock('../../../src/service/token.service');
jest.mock('aea-logger');

describe('controllers.getToken', () => {
    const mockRequest = {
        query: { xsid: 'test-xsid' },
    } as unknown as FastifyRequest<{ Body: ITLToken }>;

    const mockReply = {
        header: jest.fn().mockReturnThis(),
        send: jest.fn(),
    } as unknown as FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería devolver el token cuando tokenService es exitoso', async () => {
        const mockResponse = { access_token: 'test-token' };
        (tokenService as jest.Mock).mockResolvedValue(mockResponse);

        await controllers.getToken(mockRequest, mockReply);

        expect(tokenService).toHaveBeenCalledWith('test-xsid');
        expect(mockReply.header).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(mockReply.send).toHaveBeenCalledWith(mockResponse);
        expect(operationalTracer.info).toHaveBeenCalledWith('getToken', {
            request: { getToken: { xsid: 'test-xsid' } },
            response: { getToke: mockResponse },
            statusCode: constants.HTTP_STATUS_OK,
        });
    });

    it('debería manejar el error cuando tokenService falla', async () => {
        const mockError = new Error('Service failed');
        (tokenService as jest.Mock).mockRejectedValue(mockError);

        await expect(controllers.getToken(mockRequest, mockReply)).rejects.toThrow(mockError);

        expect(tokenService).toHaveBeenCalledWith('test-xsid');
        expect(mockReply.header).not.toHaveBeenCalled();
        expect(mockReply.send).not.toHaveBeenCalled();
        expect(operationalTracer.info).not.toHaveBeenCalled();
    });
});