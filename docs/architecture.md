# Architecture

## High-Level Overview

RateShift follows a **monorepo** layout with two top-level packages:

| Directory | Role                                |
| --------- | ----------------------------------- |
| `client/` | React single-page application (SPA) |
| `server/` | Node.js / Express REST API          |

The client communicates with the server exclusively through a set of REST endpoints under `/api/`. The server acts as a proxy and caching layer: it fetches exchange rates from an external provider, normalizes the response, caches the result in memory, and returns a consistent JSON payload to the client.

## Data Flow

```
User --> React UI --> apiClient.js --> Express Server --> rates.service.js --> External API
                                                        |                        |
                                                        +-- in-memory cache -----+
                                                        |
User <-- React UI <-- apiClient.js <-- Express Server <-- rates.service.js
```

**Step-by-step:**

1. The user enters an amount, selects currencies, and triggers a conversion.
2. The React client calls `rateService.convertCurrency()`, which delegates to `apiClient.get()`.
3. `apiClient` issues a `GET` request to the Express server (proxied in development, direct in production).
4. The Express server routes the request through middleware (CORS, rate limiting, logging) to the rates controller.
5. The controller calls the rates service, which checks the in-memory cache.
    - **Cache hit** -- returns the cached data immediately.
    - **Cache miss** -- fetches fresh data from the configured external API, normalizes it via `apiConfig.parseResponse()`, stores the result in cache, and returns it.
6. The JSON response flows back through Express to the client.
7. The React UI updates the conversion result, and the entry is saved to conversion history in `localStorage`.

## Frontend Architecture

### Component Hierarchy

```
App
|-- Navbar (theme toggle, branding)
|-- Routes
    |-- ConverterPage
    |   |-- CurrencySelector (base)
    |   |-- AmountInput
    |   |-- CurrencySelector (target)
    |   |-- ConversionResult
    |   +-- RateTrendChart
    |-- HistoryPage
    |   +-- HistoryList
    +-- NotFound (404)
```

### Context Providers

| Context           | Purpose                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `CurrencyContext` | Stores selected currencies, conversion defaults, and history.          |
| `ThemeContext`    | Manages light/dark theme preference and persists it to `localStorage`. |

### Custom Hooks

Encapsulate reusable logic such as debounced input handling, fetching rates, and managing localStorage-backed state.

### Services Layer

| File             | Responsibility                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| `apiClient.js`   | Low-level fetch wrapper; builds URLs, handles errors, parses JSON.                                      |
| `rateService.js` | High-level functions (`convertCurrency`, `getLatestRates`, `getRateHistory`) that map to API endpoints. |

### Styling

- **CSS Custom Properties** defined in `variables.css` and `theme.css` provide a consistent design token system.
- **CSS Modules** scope component styles to avoid collisions.
- **Global styles** in `global.css` handle resets, base typography, focus indicators, and scrollbar styling.

## Backend Architecture

### Middleware Stack

Requests pass through the following middleware in order:

1. **Morgan** -- HTTP request logging (combined format in production, dev format otherwise).
2. **CORS** -- configured from the `CORS_ORIGIN` environment variable.
3. **express.json()** -- parses incoming JSON request bodies.
4. **Custom request logger** -- supplements Morgan with timestamps.
5. **Rate limiter** -- sliding-window rate limiting via `express-rate-limit`.
6. **Routes** -- matched endpoints dispatch to controllers.
7. **Error handler** -- centralized error middleware (registered last).

### Routes, Controllers, and Services

```
routes/
  rates.routes.js   --> maps HTTP verbs/paths to controller methods
  health.routes.js  --> lightweight health check endpoint

controllers/
  rates.controller.js --> validates input, calls the service, formats the response

services/
  rates.service.js    --> business logic: cache lookup, external API call, normalization

config/
  env.js              --> centralized environment variable access with defaults
  apiConfig.js        --> provider definitions (buildUrl, parseResponse)
```

### Provider-Agnostic Design

The `apiConfig.js` module defines a `providers` object where each key is a provider name (`exchangerate-api`, `openexchangerates`, `mock`). Every provider implements two functions:

- `buildUrl(baseCurrency)` -- constructs the request URL.
- `parseResponse(data)` -- normalizes the upstream JSON into a common `{ base, rates, timestamp }` shape.

Adding a new provider requires only a new entry in this object -- no changes to the controller or service layer.

### In-Memory Cache

- Keyed by base currency code.
- TTL is configurable via the `CACHE_TTL_MINUTES` environment variable (default: 5 minutes).
- On cache miss, the service fetches fresh data, stores it, and sets a TTL expiration.
- Cache entries are evicted automatically when their TTL expires.

## State Management

| Layer              | Mechanism                           | Scope                                                    |
| ------------------ | ----------------------------------- | -------------------------------------------------------- |
| Theme              | React Context + `localStorage`      | Global -- persists across sessions.                      |
| Currency defaults  | React Context + `localStorage`      | Global -- last-used base/target currencies.              |
| Conversion history | React Context + `localStorage`      | Global -- list of recent conversions.                    |
| UI state           | Component `useState` / `useReducer` | Local -- loading spinners, input values, error messages. |

## Error Handling

### Client

- **ErrorBanner component** -- displays dismissible error messages returned from the API or caught during network failures.
- **try/catch in service calls** -- every `apiClient.get()` call is wrapped so errors propagate to the UI gracefully.
- **Loading states** -- spinners and disabled inputs while async operations are in progress prevent user confusion.

### Server

- **Centralized error handler middleware** -- catches all unhandled errors, logs the stack trace, and returns a structured JSON response:
    ```json
    {
        "success": false,
        "error": "Descriptive error message"
    }
    ```
- **HTTP status codes** -- `400` for validation errors, `404` for unknown routes, `429` for rate limit exceeded, `500` for upstream failures.
- **Descriptive messages** -- every error response includes a human-readable message suitable for display in the client UI.
