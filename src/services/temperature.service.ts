import { TemperatureResult, TemperatureUnit, ApiError } from '../types';

// Absolute zero in each unit, used to reject physically impossible values.
const ABSOLUTE_ZERO = {
  kelvin: 0,
  celsius: -273.15,
  fahrenheit: -459.67,
} as const;

// Small epsilon to tolerate floating point rounding when checking absolute zero.
const EPSILON = 1e-9;

/**
 * Converts a single temperature value (in the given unit) into all three
 * supported units: Celsius, Fahrenheit, and Kelvin.
 *
 * Throws an ApiError (400) if the value is below absolute zero for its unit.
 */
export function convertTemperature(
  value: number,
  unit: TemperatureUnit
): TemperatureResult {
  if (value < ABSOLUTE_ZERO[unit] - EPSILON) {
    throw new ApiError(
      400,
      'BELOW_ABSOLUTE_ZERO',
      `Value ${value} ${unit} is below absolute zero (${ABSOLUTE_ZERO[unit]} ${unit}).`
    );
  }

  let celsius: number;

  switch (unit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = ((value - 32) * 5) / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }

  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = celsius + 273.15;

  return {
    celsius: roundTo(celsius, 4),
    fahrenheit: roundTo(fahrenheit, 4),
    kelvin: roundTo(kelvin, 4),
  };
}

/**
 * Rounds a number to a given number of decimal places while avoiding
 * common floating point artifacts (e.g. 21.099999999999998).
 */
function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}
