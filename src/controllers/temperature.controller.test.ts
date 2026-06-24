import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('GET /convert', () => {
  it('converts celsius and returns all three units', async () => {
    const res = await request(app).get('/convert?celsius=100');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      input: { unit: 'celsius', value: 100 },
      result: { celsius: 100, fahrenheit: 212, kelvin: 373.15 },
    });
  });

  it('converts fahrenheit and returns all three units', async () => {
    const res = await request(app).get('/convert?fahrenheit=15');
    expect(res.status).toBe(200);
    expect(res.body.input).toEqual({ unit: 'fahrenheit', value: 15 });
    expect(res.body.result.fahrenheit).toBe(15);
  });

  it('converts kelvin and returns all three units', async () => {
    const res = await request(app).get('/convert?kelvin=273');
    expect(res.status).toBe(200);
    expect(res.body.input).toEqual({ unit: 'kelvin', value: 273 });
    expect(res.body.result.kelvin).toBe(273);
  });

    it('returns 400 when no parameter is provided', async () => {
    const res = await request(app).get('/convert');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('MISSING_PARAMETER');
  });

  it('returns 400 when an invalid parameter is provided', async () => {
    const res = await request(app).get('/convert?milligram=100');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PARAMETER');
  });

  it('returns 400 when multiple parameters are provided', async () => {
    const res = await request(app).get('/convert?celsius=10&millimeter=100');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('MULTIPLE_PARAMETERS');
  });

  it('returns 400 when value is not numeric', async () => {
    const res = await request(app).get('/convert?celsius=abc');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_VALUE');
  });

  it('returns 400 when value is below absolute zero', async () => {
    const res = await request(app).get('/convert?celsius=-400');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('CONVERSION_ERROR');
    expect(res.body.error.message).toContain('below absolute zero');
  });

  it('serves the Swagger documentation page', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
    expect(res.text).toContain('Swagger UI');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});
