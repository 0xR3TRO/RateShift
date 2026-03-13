/**
 * useExchangeRates.js — Fetch conversion data from the API with debouncing.
 */

import { useState, useEffect, useRef } from "react";
import useDebouncedValue from "./useDebouncedValue";
import { convertCurrency, getRateHistory } from "../services/rateService";

/**
 * Custom hook that fetches exchange-rate data for a given currency pair and
 * amount. The API call is debounced so rapid input changes do not flood the
 * server.
 *
 * @param {{ base: string, target: string, amount: number|string }} params
 * @returns {{
 *   rate: number|null,
 *   convertedAmount: number|null,
 *   timestamp: string|null,
 *   trend: 'up'|'down'|'flat'|null,
 *   historyData: Array<{date:string, rate:number}>,
 *   loading: boolean,
 *   error: string|null,
 * }}
 */
export default function useExchangeRates({ base, target, amount }) {
    const [rate, setRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [trend, setTrend] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedBase = useDebouncedValue(base, 300);
    const debouncedTarget = useDebouncedValue(target, 300);
    const debouncedAmount = useDebouncedValue(amount, 400);

    // Track the latest request so we can ignore stale responses
    const requestId = useRef(0);

    // Fetch conversion whenever debounced values change
    useEffect(() => {
        const numericAmount = parseFloat(debouncedAmount);

        if (
            !debouncedBase ||
            !debouncedTarget ||
            !debouncedAmount ||
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {
            setRate(null);
            setConvertedAmount(null);
            setTimestamp(null);
            setTrend(null);
            setError(null);
            return;
        }

        const id = ++requestId.current;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const data = await convertCurrency(
                    debouncedBase,
                    debouncedTarget,
                    numericAmount,
                );

                // Discard if a newer request has been issued
                if (id !== requestId.current) return;

                setRate(data.rate ?? null);
                setConvertedAmount(data.convertedAmount ?? data.result ?? null);
                setTimestamp(data.timestamp ?? new Date().toISOString());
                setTrend(data.trend ?? null);
            } catch (err) {
                if (id !== requestId.current) return;
                setError(err.message || "Conversion failed. Please try again.");
                setRate(null);
                setConvertedAmount(null);
            } finally {
                if (id === requestId.current) setLoading(false);
            }
        })();
    }, [debouncedBase, debouncedTarget, debouncedAmount]);

    // Fetch 7-day history whenever the pair changes
    useEffect(() => {
        if (!debouncedBase || !debouncedTarget) return;

        let cancelled = false;

        (async () => {
            try {
                const data = await getRateHistory(
                    debouncedBase,
                    debouncedTarget,
                );
                if (cancelled) return;
                const history = data.history || data.data || data || [];
                setHistoryData(Array.isArray(history) ? history : []);
            } catch {
                if (!cancelled) setHistoryData([]);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [debouncedBase, debouncedTarget]);

    return {
        rate,
        convertedAmount,
        timestamp,
        trend,
        historyData,
        loading,
        error,
    };
}
