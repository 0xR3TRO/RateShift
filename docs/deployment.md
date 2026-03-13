# Deployment Guide

## Prerequisites

| Requirement | Minimum Version | Notes                                                            |
| ----------- | --------------- | ---------------------------------------------------------------- |
| Node.js     | 18+             | LTS recommended. Verify with `node -v`.                          |
| npm         | 9+              | Ships with Node.js. Verify with `npm -v`.                        |
| API key     | --              | Required only if using a real exchange rate provider (not mock). |

## Development

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/RateShift.git
cd RateShift
```

### 2. Install Dependencies

The root `package.json` provides a convenience script that installs dependencies for the root, client, and server in one command:

```bash
npm run install:all
```

### 3. Configure Environment

Copy the example environment file and edit it to match your setup:

```bash
cp .env.example .env
```

See the [Configuration Guide](configuration.md) for a full reference of every variable.

### 4. Start the Development Servers

```bash
npm run dev
```

This uses **concurrently** to run both servers in parallel:

| Service  | URL                     | Details                                     |
| -------- | ----------------------- | ------------------------------------------- |
| Frontend | `http://localhost:3000` | React dev server with hot module reloading. |
| Backend  | `http://localhost:5000` | Express API with Nodemon auto-restart.      |

The React development server is configured to proxy `/api` requests to the Express backend (via the `"proxy"` field in `client/package.json`), so no additional CORS setup is needed during development.

## Production Build

### Build the Client

```bash
npm run build
```

This runs `react-scripts build` inside the `client/` directory and outputs an optimized static bundle to `client/build/`.

### Start the Production Server

```bash
npm start
```

This starts the Express server from `server/src/server.js`. In production, you can optionally serve the `client/build/` directory as static files from Express, or deploy the frontend and backend independently.

## Deploying the Frontend

### Vercel

1. Import the repository in the Vercel dashboard.
2. Set the following build settings:

| Setting          | Value            |
| ---------------- | ---------------- |
| Framework Preset | Create React App |
| Root Directory   | `client`         |
| Build Command    | `npm run build`  |
| Output Directory | `build`          |

3. Add environment variables:

| Variable                 | Value                                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| `REACT_APP_API_BASE_URL` | URL of your deployed backend, e.g. `https://rateshift-api.onrender.com/api` |

4. Deploy. Vercel will build and serve the React app automatically.

### Netlify

1. Connect the repository in the Netlify dashboard.
2. Configure the build:

| Setting           | Value           |
| ----------------- | --------------- |
| Base Directory    | `client`        |
| Build Command     | `npm run build` |
| Publish Directory | `client/build`  |

3. Set the `REACT_APP_API_BASE_URL` environment variable to point to your backend.
4. Add a `_redirects` file to `client/public/` for SPA routing:

```
/*    /index.html   200
```

5. Deploy.

## Deploying the Backend

### Render

1. Create a new **Web Service** in the Render dashboard.
2. Connect the repository and configure:

| Setting           | Value                |
| ----------------- | -------------------- |
| Root Directory    | `server`             |
| Build Command     | `npm install`        |
| Start Command     | `node src/server.js` |
| Health Check Path | `/api/health`        |

3. Add environment variables:

| Variable                | Example Value                               |
| ----------------------- | ------------------------------------------- |
| `NODE_ENV`              | `production`                                |
| `PORT`                  | `10000` (Render assigns this automatically) |
| `EXCHANGE_PROVIDER`     | `exchangerate-api`                          |
| `EXCHANGE_API_KEY`      | `your_api_key_here`                         |
| `EXCHANGE_API_BASE_URL` | `https://v6.exchangerate-api.com/v6`        |
| `CACHE_TTL_MINUTES`     | `10`                                        |
| `CORS_ORIGIN`           | `https://your-frontend-domain.vercel.app`   |

4. Deploy. Render will install dependencies and start the server.

### Heroku

1. Create a new Heroku app.
2. Set the buildpack to Node.js.
3. Configure the start command via `Procfile` in the repository root:

```
web: cd server && node src/server.js
```

4. Set the same environment variables listed above using `heroku config:set`.
5. Push to Heroku:

```bash
git push heroku main
```

## Docker (Optional)

For containerized deployments, a basic Dockerfile concept:

```dockerfile
# ---- Build stage (client) ----
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---- Production stage (server) ----
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/ ./server/
COPY --from=client-build /app/client/build ./client/build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server/src/server.js"]
```

Build and run:

```bash
docker build -t rateshift .
docker run -p 5000:5000 --env-file .env rateshift
```

## Environment Variables Reference

| Variable                  | Description                                                              | Default                 | Required                |
| ------------------------- | ------------------------------------------------------------------------ | ----------------------- | ----------------------- |
| `NODE_ENV`                | Runtime environment (`development`, `production`, `test`)                | `development`           | No                      |
| `PORT`                    | Port the Express server listens on                                       | `5000`                  | No                      |
| `EXCHANGE_PROVIDER`       | Exchange rate provider (`exchangerate-api`, `openexchangerates`, `mock`) | `mock`                  | No                      |
| `EXCHANGE_API_KEY`        | API key for the external provider                                        | _(empty)_               | Yes (if not using mock) |
| `EXCHANGE_API_BASE_URL`   | Base URL for the external API                                            | _(provider default)_    | No                      |
| `CACHE_TTL_MINUTES`       | How long cached rates remain valid (minutes)                             | `5`                     | No                      |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit sliding window (milliseconds)                                 | `900000` (15 min)       | No                      |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per rate limit window                                       | `100`                   | No                      |
| `CORS_ORIGIN`             | Allowed CORS origin                                                      | `http://localhost:3000` | No                      |
| `REACT_APP_API_BASE_URL`  | Backend API URL used by the React client                                 | `/api`                  | No (production only)    |
