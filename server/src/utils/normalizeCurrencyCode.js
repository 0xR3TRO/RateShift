/**
 * Normalize and validate a currency code.
 * Ensures the code is a 3-letter uppercase ISO 4217 string.
 *
 * @param {string} code — Raw currency code input.
 * @returns {string} Normalized currency code (e.g. "USD").
 * @throws {Error} If the code is missing or invalid.
 */
function normalizeCurrencyCode(code) {
    if (!code || typeof code !== "string") {
        const err = new Error(
            "Currency code is required and must be a string.",
        );
        err.status = 400;
        throw err;
    }

    const normalized = code.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(normalized)) {
        const err = new Error(
            `Invalid currency code "${code}". Must be a 3-letter ISO 4217 code (e.g. USD, EUR).`,
        );
        err.status = 400;
        throw err;
    }

    return normalized;
}

module.exports = normalizeCurrencyCode;
