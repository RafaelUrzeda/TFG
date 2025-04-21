import { TokenHydraServiceError } from '../../../src/common/errors/tokenHydraServiceError';
import { postSTSCheck } from '../../../src/externals/sts.external';
import { getTokenHydra } from '../../../src/externals/token.external';
import { tokenService } from '../../../src/service/token.service';

jest.mock('../../../src/externals/sts.external');
jest.mock('../../../src/externals/token.external');

describe('tokenService', () => {
    const xsid = 'test-xsid';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería devolver el token cuando postSTSCheck devuelve success: true', async () => {
        (postSTSCheck as jest.Mock).mockResolvedValue({ success: true });
        (getTokenHydra as jest.Mock).mockResolvedValue({ access_token: 'test-token' });

        const result = await tokenService(xsid);

        expect(postSTSCheck).toHaveBeenCalledWith(xsid);
        expect(getTokenHydra).toHaveBeenCalled();
        expect(result).toEqual({"access_token": "test-token"});
    });

    it('debería lanzar un TokenHydraServiceError cuando postSTSCheck devuelve success: false', async () => {
        (postSTSCheck as jest.Mock).mockResolvedValue({ success: false });

        await expect(tokenService(xsid)).rejects.toThrow(TokenHydraServiceError);

        expect(postSTSCheck).toHaveBeenCalledWith(xsid);
        expect(getTokenHydra).not.toHaveBeenCalled();
    });
});