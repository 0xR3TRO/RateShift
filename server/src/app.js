/**
 * RateShift Express Application
 *
 * Configures all middleware, mounts route handlers, and attaches the global
 * error handler. The app instance is exported separately from the server so
 * it can be used in integration tests without opening a real port.
 */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const corsConfig = require("./middleware/corsConfig");
const requestLogger = require("./middleware/requestLogger");
const rateLimit = require("./middleware/rateLimit");
const errorHandler = require("./middleware/errorHandler");

const ratesRoutes = require("./routes/rates.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

// HTTP request logging (Apache-style combined format in production, dev otherwise)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS — configured from environment
app.use(cors(corsConfig));

// Parse incoming JSON request bodies
app.use(express.json());

// Custom request logger (supplements morgan with timestamps)
app.use(requestLogger);

// Rate limiting to protect against abuse
app.use(rateLimit);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use("/api/rates", ratesRoutes);
app.use("/api/health", healthRoutes);

// ---------------------------------------------------------------------------
// Global error handler (must be registered last)
// ---------------------------------------------------------------------------

app.use(errorHandler);

module.exports = app;
