import { convertTemperature } from '../services/temperature.service';
import { ApiError } from '../types';

describe('convertTemperature', () => {
  it('converts from celsius correctly', () => {
    const result = convertTemperature(100, 'celsius');
    expect(result.celsius).toBe(100);
    expect(result.fahrenheit).toBe(212);
    expect(result.kelvin).toBe(373.15);
  });

  it('converts from fahrenheit correctly', () => {
    const result = convertTemperature(32, 'fahrenheit');
    expect(result.celsius).toBe(0);
    expect(result.fahrenheit).toBe(32);
    expect(result.kelvin).toBe(273.15);
  });

  it('converts from kelvin correctly', () => {
    const result = convertTemperature(273.15, 'kelvin');
    expect(result.celsius).toBe(0);
    expect(result.fahrenheit).toBe(32);
    expect(result.kelvin).toBe(273.15);
  });

  it('handles negative celsius values above absolute zero', () => {
    const result = convertTemperature(-40, 'celsius');
    expect(result.fahrenheit).toBe(-40);
    expect(result.kelvin).toBe(233.15);
  });

  it('throws when value is below absolute zero in kelvin', () => {
    expect(() => convertTemperature(-1, 'kelvin')).toThrow(ApiError);
  });

  it('throws when value is below absolute zero in celsius', () => {
    expect(() => convertTemperature(-300, 'celsius')).toThrow(ApiError);
  });

  it('throws when value is below absolute zero in fahrenheit', () => {
    expect(() => convertTemperature(-500, 'fahrenheit')).toThrow(ApiError);
  });

  it('allows exactly absolute zero', () => {
    expect(() => convertTemperature(0, 'kelvin')).not.toThrow();
    expect(() => convertTemperature(-273.15, 'celsius')).not.toThrow();
  });
});
