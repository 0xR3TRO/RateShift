/**
 * validateAmount.js — Input validation for the currency amount field.
 */

const MAX_AMOUNT = 999999999;

/**
 * Validate a user-entered amount string.
 *
 * @param {string} value — The raw input value.
 * @returns {{ isValid: boolean, error: string|null }}
 */
export function validateAmount(value) {
    if (value === undefined || value === null || String(value).trim() === "") {
        return { isValid: false, error: "Please enter an amount." };
    }

    const trimmed = String(value).trim();

    // Allow digits, optional decimals, and leading/trailing whitespace
    if (!/^\d+(\.\d*)?$/.test(trimmed)) {
        return { isValid: false, error: "Please enter a valid number." };
    }

    const num = parseFloat(trimmed);

    if (Number.isNaN(num)) {
        return { isValid: false, error: "Please enter a valid number." };
    }

    if (num <= 0) {
        return { isValid: false, error: "Amount must be greater than zero." };
    }

    if (num > MAX_AMOUNT) {
        return {
            isValid: false,
            error: `Amount cannot exceed ${MAX_AMOUNT.toLocaleString("en-US")}.`,
        };
    }

    return { isValid: true, error: null };
}
