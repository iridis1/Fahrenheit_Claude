import { Request, Response, NextFunction } from 'express';
import { convertTemperature } from '../services/temperature.service';
import { ApiError, ConvertSuccessResponse, TemperatureUnit } from '../types';

const SUPPORTED_UNITS: TemperatureUnit[] = ['celsius', 'fahrenheit', 'kelvin'];

/**
 * GET /convert?celsius=100
 * GET /convert?fahrenheit=15
 * GET /convert?kelvin=273
 *
 * Exactly one of the three query parameters must be supplied.
 * Responds with the value converted into all three units.
 */
export function convertHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const providedUnits = SUPPORTED_UNITS.filter(
      (unit) => req.query[unit] !== undefined
    );

    if (providedUnits.length === 0) {
      throw new ApiError(
        400,
        'MISSING_PARAMETER',
        'Provide exactly one query parameter: celsius, fahrenheit, or kelvin.'
      );
    }

    if (providedUnits.length > 1) {
      throw new ApiError(
        400,
        'MULTIPLE_PARAMETERS',
        `Provide exactly one temperature parameter, but received: ${providedUnits.join(', ')}.`
      );
    }

    const unit = providedUnits[0];
    const rawValue = req.query[unit];
    const value = parseTemperatureValue(rawValue, unit);

    const result = convertTemperature(value, unit);

    const response: ConvertSuccessResponse = {
      input: { unit, value },
      result,
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

/**
 * Validates that the raw query value is a single, finite numeric string
 * and parses it to a number. Throws ApiError on anything else
 * (missing, array, non-numeric, NaN, Infinity).
 */
function parseTemperatureValue(
  rawValue: unknown,
  unit: TemperatureUnit
): number {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    throw new ApiError(
      400,
      'INVALID_VALUE',
      `The value for "${unit}" must be a non-empty number.`
    );
  }

  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    throw new ApiError(
      400,
      'INVALID_VALUE',
      `The value "${rawValue}" for "${unit}" is not a valid number.`
    );
  }

  return value;
}
