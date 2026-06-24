export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

export interface TemperatureResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

export interface ConvertSuccessResponse {
  input: {
    unit: TemperatureUnit;
    value: number;
  };
  result: TemperatureResult;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}

/**
 * Custom error type used to carry an HTTP status code alongside
 * a machine-readable error code, so the error middleware can format
 * a consistent JSON response.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
