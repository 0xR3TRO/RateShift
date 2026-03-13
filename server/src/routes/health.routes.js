/**
 * Health Routes
 *
 * Provides a lightweight endpoint that monitoring tools and load balancers
 * can use to verify the server is alive and responsive.
 */

const { Router } = require("express");
const config = require("../config/env");

const router = Router();

/**
 * GET /api/health
 * Returns basic server health information.
 */
router.get("/", (_req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        provider: config.EXCHANGE_PROVIDER,
    });
});

module.exports = router;
