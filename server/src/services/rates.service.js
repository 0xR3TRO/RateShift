/**
 * Rates Service
 *
 * Responsible for fetching, caching, and returning exchange-rate data.
 * Supports multiple providers (exchangerate-api, openexchangerates, mock).
 * An in-memory cache backed by a plain Map avoids redundant network calls
 * within the configured TTL window.
 */

const axios = require("axios");
const config = require("../config/env");
const { getProvider } = require("../config/apiConfig");
const buildApiUrl = require("../utils/buildApiUrl");

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

/** @type {Map<string, { data: object, fetchedAt: number }>} */
const cache = new Map();

/** Cache TTL in milliseconds */
const CACHE_TTL_MS = config.CACHE_TTL_MINUTES * 60 * 1000;

/**
 * Returns `true` if the cached entry is still within the TTL window.
 */
function isCacheValid(entry) {
    if (!entry) return false;
    return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

// ---------------------------------------------------------------------------
// Mock rates generator
// ---------------------------------------------------------------------------

/**
 * Realistic mock rates relative to 1 unit of USD. These are loosely based
 * on real-world mid-market rates and intentionally static so that test
 * assertions can rely on deterministic values.
 */
const MOCK_RATES_FROM_USD = {
    USD: 1.0,
    EUR: 0.9214,
    GBP: 0.7892,
    JPY: 149.52,
    CHF: 0.8753,
    CAD: 1.3561,
    AUD: 1.5324,
    NZD: 1.6418,
    CNY: 7.2481,
    INR: 83.1245,
    BRL: 4.9712,
    MXN: 17.1389,
    KRW: 1326.45,
    SGD: 1.3412,
    HKD: 7.8265,
    NOK: 10.5634,
    SEK: 10.4217,
    DKK: 6.8753,
    PLN: 3.9821,
    CZK: 22.7643,
    HUF: 354.21,
    TRY: 30.1254,
    ZAR: 18.7632,
    THB: 35.4821,
    IDR: 15632.5,
    MYR: 4.7123,
    PHP: 55.8234,
    TWD: 31.4521,
    AED: 3.6725,
    SAR: 3.75,
};

/**
 * Generate mock rates for a given base currency by cross-converting through
 * the USD reference table.
 *
 * @param {string} baseCurrency - ISO 4217 currency code (e.g. 'EUR')
 * @returns {{ base: string, rates: object, timestamp: number }}
 */
function generateMockRates(baseCurrency) {
    const baseToUsd = MOCK_RATES_FROM_USD[baseCurrency];

    if (baseToUsd === undefined) {
        const err = new Error(
            `Currency "${baseCurrency}" is not supported by the mock provider.`,
        );
        err.status = 400;
        throw err;
    }

    const rates = {};
    for (const [code, usdRate] of Object.entries(MOCK_RATES_FROM_USD)) {
        // rate = how many units of `code` per 1 unit of `baseCurrency`
        rates[code] = Math.round((usdRate / baseToUsd) * 10000) / 10000;
    }

    return {
        base: baseCurrency,
        rates,
        timestamp: Date.now(),
    };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Retrieve the latest exchange rates for a base currency. Results are cached
 * in memory for the duration of the configured TTL.
 *
 * @param {string} baseCurrency - Three-letter ISO 4217 currency code
 * @returns {Promise<{ base: string, rates: object, timestamp: number }>}
 */
async function getLatestRates(baseCurrency) {
    const cacheKey = `latest:${baseCurrency}`;
    const cached = cache.get(cacheKey);

    if (isCacheValid(cached)) {
        return cached.data;
    }

    let data;

    if (config.EXCHANGE_PROVIDER === "mock") {
        // Mock provider — no network call required
        data = generateMockRates(baseCurrency);
    } else {
        // Real provider — fetch from external API
        const provider = getProvider();
        const url = buildApiUrl(baseCurrency);

        try {
            const response = await axios.get(url, { timeout: 10000 });
            data = provider.parseResponse(response.data);
        } catch (fetchError) {
            const err = new Error(
                `Failed to fetch rates from ${config.EXCHANGE_PROVIDER}: ${fetchError.message}`,
            );
            err.status = 502;
            throw err;
        }
    }

    // Store in cache
    cache.set(cacheKey, { data, fetchedAt: Date.now() });

    return data;
}

/**
 * Retrieve the exchange rate for a specific currency pair.
 *
 * @param {string} baseCurrency   - Source currency code
 * @param {string} targetCurrency - Target currency code
 * @returns {Promise<{ rate: number, timestamp: number }>}
 */
async function getRate(baseCurrency, targetCurrency) {
    const { rates, timestamp } = await getLatestRates(baseCurrency);

    const rate = rates[targetCurrency];
    if (rate === undefined) {
        const err = new Error(
            `Target currency "${targetCurrency}" is not available from the current provider.`,
        );
        err.status = 400;
        throw err;
    }

    return { rate, timestamp };
}

/**
 * Clear the in-memory cache. Useful during testing.
 */
function clearCache() {
    cache.clear();
}

module.exports = {
    getLatestRates,
    getRate,
    clearCache,
    // Exposed for testing only
    _cache: cache,
    _generateMockRates: generateMockRates,
};
