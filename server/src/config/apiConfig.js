/**
 * API Provider Configuration
 *
 * Defines how to build request URLs and how to normalize responses for each
 * supported exchange-rate provider. Adding a new provider is as simple as
 * adding another key to the `providers` object with `buildUrl` and
 * `parseResponse` functions.
 */

const config = require("./env");

// ---------------------------------------------------------------------------
// Provider definitions
// ---------------------------------------------------------------------------

const providers = {
    /**
     * exchangerate-api.com (v6)
     * Free tier: 1 500 requests / month, updated daily.
     * URL pattern: https://v6.exchangerate-api.com/v6/<KEY>/latest/<BASE>
     */
    "exchangerate-api": {
        buildUrl(baseCurrency) {
            const base =
                config.EXCHANGE_API_BASE_URL ||
                "https://v6.exchangerate-api.com/v6";
            const key = config.EXCHANGE_API_KEY;
            return `${base}/${key}/latest/${baseCurrency}`;
        },

        parseResponse(data) {
            return {
                base: data.base_code,
                rates: data.conversion_rates,
                timestamp: data.time_last_update_unix
                    ? data.time_last_update_unix * 1000
                    : Date.now(),
            };
        },
    },

    /**
     * openexchangerates.org
     * Free tier: 1 000 requests / month, hourly updates, USD base only (free).
     * URL pattern: https://openexchangerates.org/api/latest.json?app_id=<KEY>&base=<BASE>
     */
    openexchangerates: {
        buildUrl(baseCurrency) {
            const base =
                config.EXCHANGE_API_BASE_URL ||
                "https://openexchangerates.org/api";
            const key = config.EXCHANGE_API_KEY;
            return `${base}/latest.json?app_id=${key}&base=${baseCurrency}`;
        },

        parseResponse(data) {
            return {
                base: data.base,
                rates: data.rates,
                timestamp: data.timestamp ? data.timestamp * 1000 : Date.now(),
            };
        },
    },

    /**
     * Mock provider — returns deterministic but realistic rates without any
     * network call. Useful for development, CI, and demos.
     */
    mock: {
        buildUrl(/* baseCurrency */) {
            // No real URL needed; returning a sentinel value.
            return "mock://rates";
        },

        parseResponse(/* data */) {
            // Not used for mock — rates are generated directly in the service.
            return null;
        },
    },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return the provider configuration object for the currently active provider.
 * Throws if the provider name from env is not recognized.
 */
function getProvider(name) {
    const providerName = name || config.EXCHANGE_PROVIDER;
    const provider = providers[providerName];
    if (!provider) {
        throw new Error(
            `Unknown exchange-rate provider "${providerName}". ` +
                `Supported: ${Object.keys(providers).join(", ")}`,
        );
    }
    return provider;
}

module.exports = {
    providers,
    getProvider,
};
