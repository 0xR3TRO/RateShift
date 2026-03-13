/**
 * Rates Controller
 *
 * Handles HTTP request/response logic for currency conversion endpoints.
 * Business logic and external API calls are delegated to the rates service.
 */

const ratesService = require("../services/rates.service");
const normalizeCurrencyCode = require("../utils/normalizeCurrencyCode");
const config = require("../config/env");

/**
 * GET /api/rates?base=USD&target=EUR&amount=100
 *
 * Converts `amount` from `base` currency to `target` currency using the
 * latest available exchange rate.
 */
async function convert(req, res, next) {
    try {
        const { base, target, amount } = req.query;

        // --- Validation ---
        if (!base || !target || amount === undefined || amount === "") {
            return res.status(400).json({
                success: false,
                error: {
                    message:
                        "Missing required query parameters: base, target, and amount.",
                    status: 400,
                },
            });
        }

        const normalizedBase = normalizeCurrencyCode(base);
        const normalizedTarget = normalizeCurrencyCode(target);

        const parsedAmount = parseFloat(amount);
        if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message:
                        'The "amount" parameter must be a non-negative number.',
                    status: 400,
                },
            });
        }

        // --- Service call ---
        const { rate, timestamp } = await ratesService.getRate(
            normalizedBase,
            normalizedTarget,
        );

        const convertedAmount = Math.round(parsedAmount * rate * 10000) / 10000;

        return res.json({
            success: true,
            base: normalizedBase,
            target: normalizedTarget,
            rate,
            amount: parsedAmount,
            convertedAmount,
            timestamp,
            provider: config.EXCHANGE_PROVIDER,
        });
    } catch (err) {
        return next(err);
    }
}

/**
 * GET /api/rates/latest?base=USD
 *
 * Returns the full set of latest exchange rates for the given base currency.
 */
async function getLatestRates(req, res, next) {
    try {
        const { base } = req.query;

        if (!base) {
            return res.status(400).json({
                success: false,
                error: {
                    message: "Missing required query parameter: base.",
                    status: 400,
                },
            });
        }

        const normalizedBase = normalizeCurrencyCode(base);
        const data = await ratesService.getLatestRates(normalizedBase);

        return res.json({
            success: true,
            ...data,
            provider: config.EXCHANGE_PROVIDER,
        });
    } catch (err) {
        return next(err);
    }
}

/**
 * GET /api/rates/history?base=USD&target=EUR
 *
 * Returns mock trend data for the last 7 days showing slight random variance
 * around the current rate. (A production implementation would query a time-
 * series database or a paid historical-rates API.)
 */
async function getRateHistory(req, res, next) {
    try {
        const { base, target } = req.query;

        if (!base || !target) {
            return res.status(400).json({
                success: false,
                error: {
                    message:
                        "Missing required query parameters: base and target.",
                    status: 400,
                },
            });
        }

        const normalizedBase = normalizeCurrencyCode(base);
        const normalizedTarget = normalizeCurrencyCode(target);

        // Fetch current rate so mock history is anchored to a realistic value
        const { rate: currentRate } = await ratesService.getRate(
            normalizedBase,
            normalizedTarget,
        );

        // Generate 7 days of mock history with small random variance (+/- 2%)
        const history = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Deterministic-ish variance seeded from the day offset
            const variance = 1 + (Math.random() * 0.04 - 0.02); // -2% to +2%
            const rate = Math.round(currentRate * variance * 10000) / 10000;

            history.push({
                date: date.toISOString().split("T")[0], // YYYY-MM-DD
                rate,
            });
        }

        return res.json({
            success: true,
            base: normalizedBase,
            target: normalizedTarget,
            history,
            provider: config.EXCHANGE_PROVIDER,
        });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    convert,
    getLatestRates,
    getRateHistory,
};
