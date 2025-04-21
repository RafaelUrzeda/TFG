import { ErrorResponse } from '../../../src/common/errorResponse';

describe('ErrorResponse', () => {
  it('should initialize errorCode and errorDescription correctly', () => {
    const errorCode = '404';
    const errorDescription = 'Not Found';
    const errorResponse = new ErrorResponse(errorCode, errorDescription);

    expect(errorResponse.errorCode).toBe(errorCode);
    expect(errorResponse.errorDescription).toBe(errorDescription);
  });
});