/**
 * CurrencyContext.jsx — Global state for default currencies, conversion
 * history, and display preferences.
 */

import React, { createContext, useContext, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const HISTORY_MAX = 10;

const CurrencyContext = createContext({
    defaultBase: "USD",
    defaultTarget: "EUR",
    conversionHistory: [],
    decimalPlaces: 2,
    addConversion: () => {},
    clearHistory: () => {},
    setDefaults: () => {},
    setDecimalPlaces: () => {},
});

/**
 * Consume the currency context.
 */
export function useCurrency() {
    return useContext(CurrencyContext);
}

/**
 * CurrencyProvider — stores user preferences and recent conversion history
 * in localStorage so they survive page reloads.
 */
export function CurrencyProvider({ children }) {
    const [defaultBase, setDefaultBase] = useLocalStorage(
        "rateshift-default-base",
        "USD",
    );
    const [defaultTarget, setDefaultTarget] = useLocalStorage(
        "rateshift-default-target",
        "EUR",
    );
    const [conversionHistory, setConversionHistory] = useLocalStorage(
        "rateshift-history",
        [],
    );
    const [decimalPlaces, setDecimalPlacesRaw] = useLocalStorage(
        "rateshift-decimals",
        2,
    );

    /**
     * Push a new conversion record to the front of the history.
     * Caps the list at HISTORY_MAX entries.
     */
    const addConversion = useCallback(
        (entry) => {
            setConversionHistory((prev) => {
                const next = [
                    {
                        ...entry,
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                    },
                    ...prev,
                ];
                return next.slice(0, HISTORY_MAX);
            });
        },
        [setConversionHistory],
    );

    /** Clear all conversion history. */
    const clearHistory = useCallback(() => {
        setConversionHistory([]);
    }, [setConversionHistory]);

    /** Update default base and target currencies. */
    const setDefaults = useCallback(
        (base, target) => {
            if (base) setDefaultBase(base);
            if (target) setDefaultTarget(target);
        },
        [setDefaultBase, setDefaultTarget],
    );

    /** Update the number of decimal places displayed in results. */
    const setDecimalPlaces = useCallback(
        (value) => {
            const num = parseInt(value, 10);
            if (!Number.isNaN(num) && num >= 0 && num <= 6) {
                setDecimalPlacesRaw(num);
            }
        },
        [setDecimalPlacesRaw],
    );

    return (
        <CurrencyContext.Provider
            value={{
                defaultBase,
                defaultTarget,
                conversionHistory,
                decimalPlaces,
                addConversion,
                clearHistory,
                setDefaults,
                setDecimalPlaces,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export default CurrencyContext;
