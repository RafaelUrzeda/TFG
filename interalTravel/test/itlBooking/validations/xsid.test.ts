import { postSTSCheck } from "../../../src/externals/sts.external";
import { validateXsid } from "../../../src/validations/xsid.validations";

jest.mock("../../../src/externals/sts.external");
jest.mock("../../../src/common/errors/authorization");

describe('validarXsid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true when postSTSCheck returns a successful response', async () => {
        (postSTSCheck as jest.Mock).mockResolvedValue({ success: true });

        const result = await validateXsid('valid-xsid');
        expect(result).toBe(true);
    });

});