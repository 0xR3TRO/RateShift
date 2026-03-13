/**
 * useDebouncedValue.js — Debounce any rapidly-changing value.
 *
 * Returns the latest value only after the caller has stopped updating it
 * for the specified delay period.
 */

import { useState, useEffect } from "react";

/**
 * @param {any}    value — The value to debounce.
 * @param {number} delay — Debounce delay in milliseconds (default 400).
 * @returns {any} The debounced value.
 */
export default function useDebouncedValue(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
