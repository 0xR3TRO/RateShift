/**
 * RateShift API Server — Entry Point
 *
 * Loads environment variables, imports the Express application, and starts
 * listening on the configured port. Handles graceful shutdown signals so
 * the process can be terminated cleanly in production environments.
 */

const path = require("path");

// Load .env from the project root (two levels up from server/src/)
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app");
const config = require("./config/env");

const PORT = config.PORT;

const server = app.listen(PORT, () => {
    console.log(
        `[RateShift] Server running in ${config.NODE_ENV} mode on port ${PORT}`,
    );
});

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------

/**
 * Closes the HTTP server and exits the process. Called when the runtime
 * receives SIGTERM or SIGINT (e.g. Ctrl-C, container orchestrator stop).
 */
function shutdown(signal) {
    console.log(
        `\n[RateShift] Received ${signal}. Shutting down gracefully...`,
    );
    server.close(() => {
        console.log("[RateShift] HTTP server closed. Exiting.");
        process.exit(0);
    });

    // Force exit if the server hasn't closed within 10 seconds
    setTimeout(() => {
        console.error("[RateShift] Forced shutdown after timeout.");
        process.exit(1);
    }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = server;
