/**
 * Rates Routes
 *
 * Maps HTTP endpoints under /api/rates to the corresponding controller
 * actions for currency conversion, latest rates, and historical trend data.
 */

const { Router } = require("express");
const ratesController = require("../controllers/rates.controller");

const router = Router();

/**
 * GET /api/rates
 * Convert an amount from one currency to another.
 * Query params: base, target, amount
 */
router.get("/", ratesController.convert);

/**
 * GET /api/rates/latest
 * Retrieve the latest exchange rates for a given base currency.
 * Query params: base
 */
router.get("/latest", ratesController.getLatestRates);

/**
 * GET /api/rates/history
 * Retrieve mock historical trend data for a currency pair (last 7 days).
 * Query params: base, target
 */
router.get("/history", ratesController.getRateHistory);

module.exports = router;
