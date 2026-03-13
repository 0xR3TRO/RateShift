/**
 * useLocalStorage.js — Persist state in localStorage with JSON serialization.
 */

import { useState, useCallback } from "react";

/**
 * A useState-like hook that persists its value to localStorage.
 *
 * @param {string} key          — The localStorage key.
 * @param {any}    initialValue — The fallback value when nothing is stored.
 * @returns {[any, Function]} A tuple of [storedValue, setValue].
 */
export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.warn(
                    `[useLocalStorage] Failed to set "${key}":`,
                    error,
                );
            }
        },
        [key, storedValue],
    );

    return [storedValue, setValue];
}
