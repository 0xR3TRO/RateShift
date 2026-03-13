/**
 * Rate Limiter Middleware
 *
 * Uses express-rate-limit to cap the number of requests a single IP address
 * can make within a sliding time window. The window size and maximum request
 * count are read from the environment configuration.
 */

const rateLimit = require("express-rate-limit");
const config = require("../config/env");

const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS, // default 15 minutes
    max: config.RATE_LIMIT_MAX_REQUESTS, // default 100 requests per window
    standardHeaders: true, // Return rate-limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers

    message: {
        success: false,
        error: {
            message: "Too many requests. Please try again later.",
            status: 429,
        },
    },
});

module.exports = limiter;
