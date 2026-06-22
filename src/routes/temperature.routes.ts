import { Router } from 'express';
import { convertHandler } from '../controllers/temperature.controller';

const router = Router();

/**
 * @openapi
 * /convert:
 *   get:
 *     summary: Convert a temperature value
 *     description: Convert a temperature from one supported unit to all three units.
 *     parameters:
 *       - in: query
 *         name: celsius
 *         schema:
 *           type: number
 *         description: Temperature value in Celsius.
 *       - in: query
 *         name: fahrenheit
 *         schema:
 *           type: number
 *         description: Temperature value in Fahrenheit.
 *       - in: query
 *         name: kelvin
 *         schema:
 *           type: number
 *         description: Temperature value in Kelvin.
 *     responses:
 *       200:
 *         description: Successful conversion response.
 *       400:
 *         description: Missing or invalid parameters.
 */
router.get('/convert', convertHandler);

export default router;
