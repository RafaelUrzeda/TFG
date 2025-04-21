export interface IFastifyError extends Error {
  code: string;
  validation: Validation[];
}

export interface Validation {
  params: {
    allowedValues: string[];
  };
}
