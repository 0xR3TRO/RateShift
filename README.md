# RateShift

**Advanced real-time currency converter -- full-stack React + Node.js monorepo.**

A fast, accurate, and beautifully designed currency conversion application built with modern web technologies. RateShift pairs a responsive React frontend with a robust Express API backend, all managed in a single repository for streamlined development and deployment.

---

## Features

- **Real-time exchange rates** from configurable providers (ExchangeRate-API, OpenExchangeRates, or built-in mock)
- **Instant currency conversion** with smart debouncing to minimize unnecessary API calls
- **30+ supported currencies** with searchable selectors, symbols, and country flags
- **Conversion history** persisted in localStorage across browser sessions
- **7-day rate trend visualization** with sparkline charts showing direction and percentage change
- **Light and dark theme** with system-aware defaults and manual toggle
- **Responsive mobile-first design** that adapts seamlessly from phones to wide desktops
- **Server-side rate caching** with configurable TTL for optimal performance
- **Rate limiting** to protect the backend against abuse
- **Comprehensive error handling** with user-friendly messages on both client and server
- **Fully documented REST API** with consistent JSON response format

---

## Quick Start

### Prerequisites

- **Node.js 18+** and **npm 9+** -- verify with `node -v` and `npm -v`
- _(Optional)_ An API key from [exchangerate-api.com](https://www.exchangerate-api.com/) or [openexchangerates.org](https://openexchangerates.org/)

### Installation

```bash
git clone https://github.com/<your-username>/RateShift.git
cd RateShift
npm run install:all
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env` to set your preferred exchange rate provider and API key. The default configuration uses the **mock provider**, which requires no API key and works out of the box.

### Start Development Servers

```bash
npm run dev
```

| Service  | URL                     | Description                         |
| -------- | ----------------------- | ----------------------------------- |
| Frontend | `http://localhost:3000` | React dev server with hot reloading |
| Backend  | `http://localhost:5000` | Express API with auto-restart       |

The React dev server proxies `/api` requests to the Express backend automatically -- no additional CORS configuration is needed during development.

---

## Architecture Overview

```
                         +-------------------+
                         |   External API    |
                         | (ExchangeRate-API |
                         |  / OpenExchange   |
                         |  / Mock Provider) |
                         +---------+---------+
                                   ^
                                   | HTTP
                                   v
+--------+    HTTP    +-----------+-----------+
|  User  | <-------> |    React Client       |
| Browser|           | (localhost:3000)       |
+--------+           +-----------+-----------+
                                 |
                            Fetch /api/*
                                 |
                                 v
                     +-----------+-----------+
                     |   Express Server      |
                     |  (localhost:5000)      |
                     |                       |
                     |  +-- Rate Limiter     |
                     |  +-- CORS             |
                     |  +-- Request Logger   |
                     |  +-- Routes           |
                     |  +-- In-Memory Cache  |
                     |  +-- Error Handler    |
                     +-----------------------+
```

**Data flow:** The user interacts with the React UI, which calls the Express API through a lightweight fetch client. The server checks its in-memory cache before reaching out to the external exchange rate provider. Responses are normalized into a consistent format regardless of the upstream provider, cached for the configured TTL, and returned to the client as JSON.

---

## Project Structure

```
RateShift/
|-- package.json                  # Root scripts (dev, build, install:all)
|-- .env.example                  # Environment variable template
|-- .gitignore
|
|-- client/                       # React frontend
|   |-- package.json
|   |-- public/
|   |   |-- index.html
|   |   +-- manifest.json
|   +-- src/
|       |-- services/
|       |   |-- apiClient.js      # Fetch wrapper with error handling
|       |   +-- rateService.js    # High-level API call functions
|       |-- utils/
|       |   |-- currencyList.js   # 30 major currencies with metadata
|       |   |-- formatNumber.js   # Intl.NumberFormat utilities
|       |   +-- validateAmount.js # Input validation logic
|       +-- styles/
|           |-- global.css        # Reset, base styles, utilities
|           |-- variables.css     # Spacing, radii, breakpoints
|           +-- theme.css         # Light and dark theme tokens
|
|-- server/                       # Express backend
|   |-- package.json
|   +-- src/
|       |-- server.js             # Entry point, graceful shutdown
|       |-- app.js                # Express app, middleware pipeline
|       |-- config/
|       |   |-- env.js            # Centralized environment config
|       |   +-- apiConfig.js      # Provider definitions (URL + parser)
|       +-- routes/
|           |-- rates.routes.js   # /api/rates endpoints
|           +-- health.routes.js  # /api/health endpoint
|
+-- docs/                         # Project documentation
    |-- overview.md
    |-- architecture.md
    |-- api-endpoints.md
    |-- deployment.md
    |-- configuration.md
    +-- ui-ux.md
```

---

## API Reference

All endpoints are served under the `/api` prefix and return consistent JSON responses.

| Method | Endpoint             | Description                                    |
| ------ | -------------------- | ---------------------------------------------- |
| `GET`  | `/api/rates`         | Convert an amount from one currency to another |
| `GET`  | `/api/rates/latest`  | Get all exchange rates for a base currency     |
| `GET`  | `/api/rates/history` | Get 7-day rate trend for a currency pair       |
| `GET`  | `/api/health`        | Server health check                            |

### Example: Convert Currency

```bash
curl "http://localhost:5000/api/rates?base=USD&target=EUR&amount=100"
```

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
        "provider": "mock"
    }
}
```

> See [docs/api-endpoints.md](docs/api-endpoints.md) for complete endpoint documentation, including all parameters, response schemas, and error codes.

---

## Configuration

RateShift is configured through environment variables defined in a `.env` file at the project root.

| Variable                  | Description                                                     | Default                 |
| ------------------------- | --------------------------------------------------------------- | ----------------------- |
| `NODE_ENV`                | Runtime environment                                             | `development`           |
| `PORT`                    | Express server port                                             | `5000`                  |
| `EXCHANGE_PROVIDER`       | Rate provider (`exchangerate-api`, `openexchangerates`, `mock`) | `mock`                  |
| `EXCHANGE_API_KEY`        | API key for external provider                                   | _(empty)_               |
| `CACHE_TTL_MINUTES`       | Cache lifetime in minutes                                       | `5`                     |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window (ms)                                          | `900000`                |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window                                         | `100`                   |
| `CORS_ORIGIN`             | Allowed CORS origin                                             | `http://localhost:3000` |
| `REACT_APP_API_BASE_URL`  | Backend URL for the client                                      | `/api`                  |

> See [docs/configuration.md](docs/configuration.md) for detailed configuration instructions, provider setup guides, and tuning recommendations.

---

## Customization

### Adding Currencies

Edit `client/src/utils/currencyList.js` and add a new entry with the ISO 4217 code, display name, symbol, and flag:

```js
{ code: 'NGN', name: 'Nigerian Naira', symbol: 'N', flag: '<flag>' },
```

### Changing Themes

Modify CSS custom properties in `client/src/styles/theme.css`. The light theme is defined on `:root` and the dark theme on `[data-theme='dark']`.

### Swapping the API Provider

Update `EXCHANGE_PROVIDER` in your `.env` file to `exchangerate-api`, `openexchangerates`, or `mock`. Add the corresponding `EXCHANGE_API_KEY` if using a real provider.

### Adjusting the Cache

Change `CACHE_TTL_MINUTES` in your `.env` file. Lower values mean fresher rates; higher values reduce external API usage.

---

## Tech Stack

| Layer        | Technologies                                                                |
| ------------ | --------------------------------------------------------------------------- |
| **Frontend** | React 18, React Router v6, CSS Modules, CSS Custom Properties, Custom Hooks |
| **Backend**  | Node.js, Express, In-memory Cache, Morgan, express-rate-limit               |
| **Testing**  | Jest, Supertest, React Testing Library                                      |
| **DevOps**   | Concurrently, Nodemon, dotenv                                               |

---

## Documentation

| Document                                     | Description                                                       |
| -------------------------------------------- | ----------------------------------------------------------------- |
| [Project Overview](docs/overview.md)         | Introduction, goals, features, and tech stack                     |
| [Architecture](docs/architecture.md)         | System design, data flow, component hierarchy                     |
| [API Endpoints](docs/api-endpoints.md)       | Complete REST API reference with examples                         |
| [Deployment Guide](docs/deployment.md)       | Production deployment for Vercel, Netlify, Render, Heroku, Docker |
| [Configuration Guide](docs/configuration.md) | Environment variables, providers, cache, rate limiting            |
| [UI/UX Design](docs/ui-ux.md)                | Design principles, color palette, typography, accessibility       |

---

## Scripts

| Command               | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Start both client and server in development mode   |
| `npm run client`      | Start only the React dev server                    |
| `npm run server`      | Start only the Express server (with Nodemon)       |
| `npm run build`       | Create an optimized production build of the client |
| `npm start`           | Start the production server                        |
| `npm test`            | Run server-side tests                              |
| `npm run test:client` | Run client-side tests                              |
| `npm run test:all`    | Run all tests concurrently                         |
| `npm run install:all` | Install dependencies for root, client, and server  |
| `npm run lint`        | Run linters for client and server                  |

---

## Future Improvements

- Historical rate charts with 30, 90, and 365-day ranges
- User accounts with saved preferences and favorite pairs
- Progressive Web App (PWA) with offline support
- Multi-language support (i18n)
- Cryptocurrency conversions (BTC, ETH, and more)
- Rate alerts and push notifications
- Batch conversions for multiple currency pairs
- Export conversion history to CSV
- WebSocket integration for live rate streaming
- End-to-end tests with Cypress or Playwright

---

## Contributing

Contributions are welcome. To get started:

1. **Fork** the repository and clone your fork locally.
2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes, ensuring code quality:
    - Follow the existing code style and conventions.
    - Add or update tests as appropriate.
    - Run `npm run test:all` and `npm run lint` before committing.
4. Commit your changes with a clear, descriptive message.
5. Push to your fork and **open a pull request** against the `main` branch.

Please ensure your PR includes a clear description of the changes and the motivation behind them.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
