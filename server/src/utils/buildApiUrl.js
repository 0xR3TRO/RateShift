const { getProvider } = require("../config/apiConfig");
const config = require("../config/env");

/**
 * Build the full API URL for fetching exchange rates from the configured
 * provider.
 *
 * @param {string} baseCurrency — Uppercase 3-letter currency code.
 * @returns {string|null} Fully-qualified URL, or null for mock provider.
 */
function buildApiUrl(baseCurrency) {
    const provider = getProvider(config.EXCHANGE_PROVIDER);

    return provider.buildUrl(baseCurrency);
}

module.exports = buildApiUrl;
