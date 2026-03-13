/**
 * Environment Configuration
 *
 * Centralizes access to all environment variables used by the server.
 * Every variable is read once from process.env, converted to the correct
 * type, and given a sensible default so the app can start even without a
 * .env file (falling back to the mock exchange-rate provider).
 */

const config = {
    /** Server port */
    PORT: parseInt(process.env.PORT, 10) || 5000,

    /** Runtime environment: 'development' | 'production' | 'test' */
    NODE_ENV: process.env.NODE_ENV || "development",

    /** Exchange-rate provider name (exchangerate-api | openexchangerates | mock) */
    EXCHANGE_PROVIDER: process.env.EXCHANGE_PROVIDER || "mock",

    /** API key for the external exchange-rate provider */
    EXCHANGE_API_KEY: process.env.EXCHANGE_API_KEY || "",

    /** Base URL for the external exchange-rate API */
    EXCHANGE_API_BASE_URL: process.env.EXCHANGE_API_BASE_URL || "",

    /** How long cached rates remain valid, in minutes */
    CACHE_TTL_MINUTES: parseInt(process.env.CACHE_TTL_MINUTES, 10) || 5,

    /** Rate-limit sliding window size in milliseconds (default 15 min) */
    RATE_LIMIT_WINDOW_MS:
        parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,

    /** Maximum requests allowed per rate-limit window */
    RATE_LIMIT_MAX_REQUESTS:
        parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

    /** Allowed CORS origin (single origin string or '*') */
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
};

module.exports = config;
