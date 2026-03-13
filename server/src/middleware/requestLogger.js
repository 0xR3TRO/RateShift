/**
 * Request Logger Middleware
 *
 * Supplements morgan by logging every incoming request with a precise
 * ISO-8601 timestamp, HTTP method, and URL. This is intentionally simple;
 * morgan handles the detailed access-log formatting.
 */

function requestLogger(req, _res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = requestLogger;
