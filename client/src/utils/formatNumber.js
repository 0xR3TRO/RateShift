/**
 * formatNumber.js — Number and currency formatting utilities powered by
 * the built-in Intl.NumberFormat API.
 */

/**
 * Format a numeric value with locale-aware grouping and decimal separators.
 *
 * @param {number|string} value    — The value to format.
 * @param {number}        decimals — Maximum fraction digits (default 2).
 * @param {string}        locale   — BCP 47 locale string (default 'en-US').
 * @returns {string} The formatted number string, or an empty string on error.
 */
export function formatNumber(value, decimals = 2, locale = "en-US") {
    const num = Number(value);
    if (Number.isNaN(num)) return "";

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    }).format(num);
}

/**
 * Format a numeric value as a currency string (e.g. "$1,234.56").
 *
 * @param {number|string} value        — The value to format.
 * @param {string}        currencyCode — ISO 4217 currency code (e.g. 'USD').
 * @param {string}        locale       — BCP 47 locale string (default 'en-US').
 * @returns {string} The formatted currency string, or an empty string on error.
 */
export function formatCurrency(value, currencyCode, locale = "en-US") {
    const num = Number(value);
    if (Number.isNaN(num)) return "";

    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
        }).format(num);
    } catch {
        // Fall back to plain number formatting if the currency code is invalid
        return formatNumber(value, 2, locale);
    }
}
