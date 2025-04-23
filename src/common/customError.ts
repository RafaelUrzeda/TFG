export class CustomError extends Error {
  public status: number;

  public errorCode: string;

  public errorDescription: string;

  constructor(
    status: number,
    code: string,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.errorCode = code;
    this.errorDescription = message;
  }
}
