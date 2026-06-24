import { Request, Response, NextFunction } from 'express';
import { convertTemperature } from '../services/temperature.service';
import { ApiError, ConvertSuccessResponse, TemperatureResult, TemperatureUnit, TEMPERATURE_UNITS } from '../types';

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
    
    if (Object.keys(req.query).length === 0) {
      throw new ApiError(
        400,
        'MISSING_PARAMETER',
        'Provide temperature parameter celsius, fahrenheit or kelvin.'
      );
    }

    if (Object.keys(req.query).length > 1) {
      throw new ApiError(
        400,
        'MULTIPLE_PARAMETERS',
        'Provide a single temperature parameter celsius, fahrenheit or kelvin.'
      );
    }

    const providedUnits = TEMPERATURE_UNITS.filter(
      (unit) => req.query[unit] !== undefined
    );

    if (providedUnits.length === 0) {
      throw new ApiError(
        400,
        'INVALID_PARAMETER',
        'Only parameter celsius, fahrenheit or kelvin is supported.'
      );
    }

    const unit = providedUnits[0];
    const rawValue = req.query[unit];
    const value = parseTemperatureValue(rawValue, unit);

    let result: TemperatureResult;

    try {
      result = convertTemperature(value, unit);
    } catch (err) {
      throw new ApiError(
        400,
        'CONVERSION_ERROR',
        err instanceof Error ? err.message : 'Conversion error'
      );
    }

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
