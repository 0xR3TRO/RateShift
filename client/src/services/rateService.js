/**
 * rateService.js — High-level service functions for exchange-rate API calls.
 */

import apiClient from "./apiClient";

/**
 * Convert an amount from one currency to another.
 *
 * @param {string} base   — Source currency code (e.g. 'USD').
 * @param {string} target — Target currency code (e.g. 'EUR').
 * @param {number} amount — The amount to convert.
 * @returns {Promise<Object>} Conversion result from the API.
 */
export async function convertCurrency(base, target, amount) {
    return apiClient.get("/rates", { base, target, amount });
}

/**
 * Fetch the latest exchange rates for a given base currency.
 *
 * @param {string} base — Base currency code.
 * @returns {Promise<Object>} Latest rates keyed by target currency code.
 */
export async function getLatestRates(base) {
    return apiClient.get("/rates/latest", { base });
}

/**
 * Fetch historical rate data for a currency pair (used for trend charts).
 *
 * @param {string} base   — Base currency code.
 * @param {string} target — Target currency code.
 * @returns {Promise<Object>} Array of { date, rate } entries.
 */
export async function getRateHistory(base, target) {
    return apiClient.get("/rates/history", { base, target });
}
