/**
 * Global Error Handler Middleware
 *
 * Catches any error that propagates out of route handlers or other
 * middleware and returns a consistent JSON error response. In development
 * mode the stack trace is included to aid debugging; in production it is
 * omitted to avoid leaking implementation details.
 */

const config = require("../config/env");

// eslint-disable-next-line no-unused-vars -- Express requires all four params for error middleware
function errorHandler(err, _req, res, _next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the full error server-side regardless of environment
    console.error(`[RateShift Error] ${status} - ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    const payload = {
        success: false,
        error: {
            message,
            status,
        },
    };

    // Include stack trace only in development / test environments
    if (config.NODE_ENV !== "production") {
        payload.error.stack = err.stack;
    }

    res.status(status).json(payload);
}

module.exports = errorHandler;
