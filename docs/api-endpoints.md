# API Endpoints

All endpoints are served under the `/api` prefix. Responses use a consistent JSON envelope:

```json
{
  "success": true,
  "data": { ... }
}
```

On error:

```json
{
    "success": false,
    "error": "Human-readable error description"
}
```

---

## GET `/api/rates`

Convert an amount from one currency to another.

### Query Parameters

| Parameter | Type   | Required | Description                                       |
| --------- | ------ | -------- | ------------------------------------------------- |
| `base`    | string | Yes      | Source currency code (ISO 4217), e.g. `USD`.      |
| `target`  | string | Yes      | Target currency code (ISO 4217), e.g. `EUR`.      |
| `amount`  | number | Yes      | The amount to convert. Must be a positive number. |

### Success Response

**Status:** `200 OK`

```json
{
    "success": true,
    "data": {
        "base": "USD",
        "target": "EUR",
        "rate": 0.8534,
        "amount": 100,
        "convertedAmount": 85.34,
        "timestamp": "2026-03-13T12:00:00.000Z",
        "provider": "exchangerate-api"
    }
}
```

### Example Request

```
GET /api/rates?base=USD&target=EUR&amount=100
```

### Error Responses

| Status | Condition                  | Example Body                                                                               |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------ |
| `400`  | Missing required parameter | `{ "success": false, "error": "Missing required query parameters: base, target, amount" }` |
| `400`  | Invalid currency code      | `{ "success": false, "error": "Invalid currency code: XYZ" }`                              |
| `400`  | Invalid amount             | `{ "success": false, "error": "Amount must be a positive number" }`                        |
| `500`  | Upstream API failure       | `{ "success": false, "error": "Failed to fetch exchange rates from provider" }`            |

---

## GET `/api/rates/latest`

Retrieve the latest exchange rates for a given base currency.

### Query Parameters

| Parameter | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `base`    | string | Yes      | Base currency code (ISO 4217), e.g. `USD`. |

### Success Response

**Status:** `200 OK`

```json
{
    "success": true,
    "data": {
        "base": "USD",
        "rates": {
            "EUR": 0.8534,
            "GBP": 0.7321,
            "JPY": 149.52,
            "CHF": 0.8812,
            "CAD": 1.3645,
            "AUD": 1.5234
        },
        "timestamp": "2026-03-13T12:00:00.000Z",
        "provider": "exchangerate-api"
    }
}
```

### Example Request

```
GET /api/rates/latest?base=USD
```

### Error Responses

| Status | Condition              | Example Body                                                                    |
| ------ | ---------------------- | ------------------------------------------------------------------------------- |
| `400`  | Missing base parameter | `{ "success": false, "error": "Missing required query parameter: base" }`       |
| `400`  | Invalid currency code  | `{ "success": false, "error": "Invalid currency code: XYZ" }`                   |
| `500`  | Upstream API failure   | `{ "success": false, "error": "Failed to fetch exchange rates from provider" }` |

---

## GET `/api/rates/history`

Retrieve 7-day mock historical rate data for a currency pair, including trend direction and percentage change.

### Query Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `base`    | string | Yes      | Base currency code (ISO 4217), e.g. `USD`.   |
| `target`  | string | Yes      | Target currency code (ISO 4217), e.g. `EUR`. |

### Success Response

**Status:** `200 OK`

```json
{
    "success": true,
    "data": {
        "base": "USD",
        "target": "EUR",
        "history": [
            { "date": "2026-03-07", "rate": 0.8501 },
            { "date": "2026-03-08", "rate": 0.8489 },
            { "date": "2026-03-09", "rate": 0.8512 },
            { "date": "2026-03-10", "rate": 0.8498 },
            { "date": "2026-03-11", "rate": 0.8523 },
            { "date": "2026-03-12", "rate": 0.853 },
            { "date": "2026-03-13", "rate": 0.8534 }
        ],
        "trend": {
            "direction": "up",
            "percentChange": 0.39
        }
    }
}
```

### Example Request

```
GET /api/rates/history?base=USD&target=EUR
```

### Error Responses

| Status | Condition                  | Example Body                                                                       |
| ------ | -------------------------- | ---------------------------------------------------------------------------------- |
| `400`  | Missing required parameter | `{ "success": false, "error": "Missing required query parameters: base, target" }` |
| `400`  | Invalid currency code      | `{ "success": false, "error": "Invalid currency code: XYZ" }`                      |
| `500`  | Internal server error      | `{ "success": false, "error": "Failed to generate rate history" }`                 |

---

## GET `/api/health`

Lightweight health check endpoint for monitoring tools and load balancers.

### Query Parameters

None.

### Success Response

**Status:** `200 OK`

```json
{
    "status": "ok",
    "uptime": 3621.45,
    "timestamp": "2026-03-13T12:00:00.000Z",
    "provider": "mock"
}
```

### Example Request

```
GET /api/health
```

### Error Responses

This endpoint does not produce client-error responses. A non-`200` status indicates the server is unreachable or unhealthy.

---

## Common HTTP Status Codes

| Code  | Meaning                                                                  |
| ----- | ------------------------------------------------------------------------ |
| `200` | Success -- the request was processed correctly.                          |
| `400` | Bad Request -- missing or invalid query parameters.                      |
| `404` | Not Found -- the requested endpoint does not exist.                      |
| `429` | Too Many Requests -- rate limit exceeded. Retry after the window resets. |
| `500` | Internal Server Error -- an unexpected error occurred on the server.     |

## Rate Limiting

All endpoints are subject to rate limiting. The default configuration allows **100 requests per 15-minute window** per IP address. When the limit is exceeded, the server responds with:

```json
{
    "success": false,
    "error": "Too many requests, please try again later."
}
```

The `Retry-After` header indicates how many seconds to wait before sending another request.
