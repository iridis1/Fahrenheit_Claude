# Temperature Converter API

A small REST API (Node.js + TypeScript + Express) that converts a temperature
in Celsius, Fahrenheit, or Kelvin into all three units.

## Setup

```bash
npm install
```

## Run in development (auto-reload)

```bash
npm run dev
```

## Build & run in production

```bash
npm run build
npm start
```

The server listens on `http://localhost:3000` by default (override with the
`PORT` environment variable).

## Run tests

```bash
npm test
```

## API

### Swagger UI

The API documentation is available at `http://localhost:3000/api-docs/` when the server is running.

### `GET /convert`

Provide **exactly one** of the following query parameters:

| Param        | Example                     |
|--------------|------------------------------|
| `celsius`    | `/convert?celsius=100`       |
| `fahrenheit` | `/convert?fahrenheit=15`     |
| `kelvin`     | `/convert?kelvin=273`        |

**Success response** (`200 OK`) — always the same shape, with all three units:

```json
{
  "input": { "unit": "kelvin", "value": 273 },
  "result": {
    "celsius": -0.15,
    "fahrenheit": 31.73,
    "kelvin": 273
  }
}
```

**Error response** (`400 Bad Request` / `404 Not Found`):

```json
{
  "error": {
    "message": "Provide exactly one query parameter: celsius, fahrenheit, or kelvin.",
    "code": "MISSING_PARAMETER"
  }
}
```

| Code                  | Cause                                              |
|-----------------------|-----------------------------------------------------|
| `MISSING_PARAMETER`   | No `celsius`/`fahrenheit`/`kelvin` param supplied   |
| `MULTIPLE_PARAMETERS` | More than one of the three params supplied          |
| `INVALID_VALUE`       | Value isn't a valid number                          |
| `BELOW_ABSOLUTE_ZERO` | Value is physically impossible (below absolute zero)|
| `NOT_FOUND`           | Unknown route                                        |

### `GET /health`

Simple liveness check, returns `{ "status": "ok" }`.

## Project structure

```
src/
  app.ts                          Express app wiring (testable, no listen())
  server.ts                       Entry point — starts the HTTP server
  routes/temperature.routes.ts    Route definitions
  controllers/                    Request parsing & validation
  services/                       Pure conversion logic + absolute-zero checks
  middleware/errorHandler.ts      Centralized error formatting (404 + 500)
  types/index.ts                 Shared types and ApiError class
```
