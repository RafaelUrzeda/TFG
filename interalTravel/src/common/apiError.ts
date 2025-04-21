export class ApiError extends Error {
  public status: number;

  public errorCode: string;

  public errorDescription: string;

  public serviceName: string;

  public request: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    serviceName: string,
    request: unknown,
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.errorCode = code;
    this.errorDescription = message;
    this.serviceName = serviceName;
    this.request = request;
  }
}
