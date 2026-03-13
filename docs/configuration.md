# Configuration Guide

## Environment Variables

RateShift uses a single `.env` file at the project root. Copy `.env.example` to get started:

```bash
cp .env.example .env
```

### Full Variable Reference

| Variable                  | Description                                                                                                                                                     | Default                   | Required                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------ |
| `NODE_ENV`                | Runtime environment. Controls logging verbosity, error detail, and optimizations. Values: `development`, `production`, `test`.                                  | `development`             | No                       |
| `PORT`                    | Port number for the Express server.                                                                                                                             | `5000`                    | No                       |
| `EXCHANGE_PROVIDER`       | Which exchange rate provider to use. Values: `exchangerate-api`, `openexchangerates`, `mock`.                                                                   | `mock`                    | No                       |
| `EXCHANGE_API_KEY`        | API key for the selected external provider. Not needed when using the `mock` provider.                                                                          | _(empty)_                 | Yes (for real providers) |
| `EXCHANGE_API_BASE_URL`   | Base URL for the external exchange rate API. Override only if you need a custom endpoint.                                                                       | Provider-specific default | No                       |
| `CACHE_TTL_MINUTES`       | Number of minutes cached exchange rates remain valid before a fresh fetch is triggered.                                                                         | `5`                       | No                       |
| `RATE_LIMIT_WINDOW_MS`    | Duration of the rate limiting sliding window in milliseconds.                                                                                                   | `900000` (15 minutes)     | No                       |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum number of requests a single IP address can make within one rate limit window.                                                                           | `100`                     | No                       |
| `CORS_ORIGIN`             | Allowed origin for cross-origin requests. Set to your frontend domain in production. Use `*` to allow all origins (not recommended for production).             | `http://localhost:3000`   | No                       |
| `REACT_APP_API_BASE_URL`  | The backend API URL that the React client uses. In development, the CRA proxy handles this automatically. In production, set this to your deployed backend URL. | `/api`                    | No (set for production)  |

## Exchange Rate Providers

RateShift supports three exchange rate providers out of the box. The active provider is controlled by the `EXCHANGE_PROVIDER` environment variable.

### Mock Provider (Default)

The mock provider returns deterministic, realistic exchange rates without making any network calls. It is ideal for development, CI pipelines, and demonstrations.

**Setup:**

```env
EXCHANGE_PROVIDER=mock
```

No API key or base URL is needed.

### ExchangeRate-API

[exchangerate-api.com](https://www.exchangerate-api.com/) offers a free tier with 1,500 requests per month and daily rate updates.

**Setup:**

1. Sign up at [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/) and obtain an API key.
2. Update your `.env` file:

```env
EXCHANGE_PROVIDER=exchangerate-api
EXCHANGE_API_KEY=your_api_key_here
EXCHANGE_API_BASE_URL=https://v6.exchangerate-api.com/v6
```

3. Restart the server. The rates service will now fetch live data from ExchangeRate-API.

### OpenExchangeRates

[openexchangerates.org](https://openexchangerates.org/) provides hourly updates. The free tier supports 1,000 requests per month with USD as the base currency.

**Setup:**

1. Sign up at [https://openexchangerates.org/signup](https://openexchangerates.org/signup) and obtain an App ID.
2. Update your `.env` file:

```env
EXCHANGE_PROVIDER=openexchangerates
EXCHANGE_API_KEY=your_oer_app_id_here
EXCHANGE_API_BASE_URL=https://openexchangerates.org/api
```

3. Restart the server.

> **Note:** The free tier of OpenExchangeRates only supports USD as the base currency. To use other base currencies, you will need a paid plan.

### Adding a New Provider

To add support for a new exchange rate API:

1. Open `server/src/config/apiConfig.js`.
2. Add a new entry to the `providers` object with two functions:
    - `buildUrl(baseCurrency)` -- constructs the full API request URL.
    - `parseResponse(data)` -- normalizes the API response into the standard `{ base, rates, timestamp }` shape.
3. Set `EXCHANGE_PROVIDER` in your `.env` file to the new provider key.

```js
'my-new-provider': {
  buildUrl(baseCurrency) {
    const key = config.EXCHANGE_API_KEY;
    return `https://api.example.com/rates?base=${baseCurrency}&key=${key}`;
  },
  parseResponse(data) {
    return {
      base: data.base,
      rates: data.rates,
      timestamp: Date.now(),
    };
  },
},
```

## Default Currencies

The default base and target currencies are managed by the `CurrencyContext` provider in the React client. To change the defaults:

1. Locate the `CurrencyContext` file in `client/src/`.
2. Update the initial state values for `baseCurrency` and `targetCurrency` to your preferred ISO 4217 codes (e.g., `'EUR'` and `'GBP'`).

The user's last-used currency pair is persisted in `localStorage` and will override these defaults on subsequent visits.

## Adding New Currencies

To add a new currency to the application:

1. **Client:** Open `client/src/utils/currencyList.js` and add a new entry to the array:

```js
{ code: 'NGN', name: 'Nigerian Naira', symbol: 'N', flag: '<flag_emoji>' },
```

2. **External API:** Verify that your configured exchange rate provider supports the new currency code.

3. **Mock provider:** If you are using the mock provider, add a corresponding mock rate in the server-side mock data generator so the currency returns realistic values.

## Cache Configuration

The server uses an in-memory cache to reduce calls to the external exchange rate API and improve response times.

### How It Works

- Exchange rates are cached in memory, keyed by the base currency code.
- When a request arrives, the service checks whether a valid (non-expired) cache entry exists.
- If the entry exists and is within the TTL, it is returned immediately.
- If the entry is missing or expired, the service fetches fresh data from the external API, caches it, and returns it.

### Adjusting the TTL

Set the `CACHE_TTL_MINUTES` environment variable to control how long cached rates remain valid:

```env
# Cache rates for 10 minutes
CACHE_TTL_MINUTES=10
```

**Guidelines:**

| Use Case                   | Recommended TTL                                                    |
| -------------------------- | ------------------------------------------------------------------ |
| Development / testing      | `1` -- frequent updates for debugging.                             |
| Production (free API tier) | `10`--`30` -- reduces API usage and stays within free tier limits. |
| Production (paid API tier) | `5` -- a good balance between freshness and performance.           |

Setting the TTL to `0` effectively disables caching (every request hits the external API).

## Rate Limiting

The server uses `express-rate-limit` to protect against abusive traffic patterns.

### Configuration

| Variable                  | Description                                   | Default               |
| ------------------------- | --------------------------------------------- | --------------------- |
| `RATE_LIMIT_WINDOW_MS`    | Sliding window duration in milliseconds.      | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum number of requests per window per IP. | `100`                 |

### Examples

```env
# Allow 200 requests per 10-minute window
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=200
```

```env
# Strict: 50 requests per 5-minute window
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX_REQUESTS=50
```

When a client exceeds the limit, the server responds with HTTP `429 Too Many Requests` and a `Retry-After` header.

## CORS

Cross-Origin Resource Sharing is configured through the `CORS_ORIGIN` environment variable.

### Single Origin (Recommended for Production)

```env
CORS_ORIGIN=https://rateshift.example.com
```

### Allow All Origins (Development Only)

```env
CORS_ORIGIN=*
```

> **Security note:** Using `*` in production is not recommended. Always restrict CORS to your known frontend domain(s).

### Local Development

During local development, the React dev server proxy handles API requests, so CORS is not typically an issue. The default value of `http://localhost:3000` covers the standard development setup.
