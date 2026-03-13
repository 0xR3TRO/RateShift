/**
 * CORS Configuration
 *
 * Builds and exports the options object consumed by the `cors` middleware.
 * The allowed origin is read from the environment so that it can differ
 * between development (localhost:3000) and production (the real domain).
 */

const config = require("../config/env");

const corsOptions = {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

module.exports = corsOptions;
