/**
 * ConverterPage.jsx — Primary application page.
 *
 * Combines the currency selectors, amount input, result card, trend sparkline,
 * and conversion history into a cohesive converter layout.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCurrency } from "../context/CurrencyContext";
import useExchangeRates from "../hooks/useExchangeRates";
import currencyList from "../utils/currencyList";
import { validateAmount } from "../utils/validateAmount";

import CurrencySelector from "../components/CurrencySelector";
import AmountInput from "../components/AmountInput";
import ResultCard from "../components/ResultCard";
import RateTrend from "../components/RateTrend";
import HistoryList from "../components/HistoryList";
import Loader from "../components/Loader";
import ErrorBanner from "../components/ErrorBanner";

import styles from "./ConverterPage.module.css";

function ConverterPage() {
    const { defaultBase, defaultTarget, addConversion } = useCurrency();

    const [base, setBase] = useState(defaultBase);
    const [target, setTarget] = useState(defaultTarget);
    const [amount, setAmount] = useState("1");
    const [apiError, setApiError] = useState(null);

    const {
        rate,
        convertedAmount,
        timestamp,
        trend,
        historyData,
        loading,
        error,
    } = useExchangeRates({ base, target, amount });

    // Track whether we have already added this result to history
    const lastAddedRef = useRef(null);

    // Auto-add successful conversions to history
    useEffect(() => {
        if (convertedAmount != null && rate != null && !loading && !error) {
            const key = `${base}-${target}-${amount}-${convertedAmount}`;
            if (lastAddedRef.current !== key) {
                lastAddedRef.current = key;
                addConversion({
                    base,
                    target,
                    amount: parseFloat(amount),
                    convertedAmount,
                    rate,
                });
            }
        }
    }, [
        convertedAmount,
        rate,
        loading,
        error,
        base,
        target,
        amount,
        addConversion,
    ]);

    // Surface API errors in a dismissible banner
    useEffect(() => {
        if (error) setApiError(error);
    }, [error]);

    // Swap base and target currencies
    const handleSwap = useCallback(() => {
        setBase((prev) => {
            setTarget(prev);
            return target;
        });
    }, [target]);

    const { isValid } =
        amount === "" ? { isValid: false } : validateAmount(amount);

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Currency Converter</h1>
                <p className={styles.subtitle}>
                    Real-time exchange rates for 30+ currencies
                </p>
            </header>

            {/* Error banner */}
            {apiError && (
                <ErrorBanner
                    message={apiError}
                    onDismiss={() => setApiError(null)}
                />
            )}

            {/* Converter form */}
            <div className={styles.converterCard}>
                {/* Currency selectors row */}
                <div className={styles.selectorRow}>
                    <div className={styles.selectorCol}>
                        <CurrencySelector
                            label="From"
                            value={base}
                            onChange={setBase}
                            currencies={currencyList}
                        />
                    </div>

                    <button
                        type="button"
                        className={styles.swapBtn}
                        onClick={handleSwap}
                        aria-label="Swap currencies"
                        title="Swap currencies"
                    >
                        &#8596;
                    </button>

                    <div className={styles.selectorCol}>
                        <CurrencySelector
                            label="To"
                            value={target}
                            onChange={setTarget}
                            currencies={currencyList}
                        />
                    </div>
                </div>

                {/* Amount input */}
                <div className={styles.amountRow}>
                    <AmountInput
                        value={amount}
                        onChange={setAmount}
                        currency={base}
                    />
                </div>
            </div>

            {/* Result */}
            {loading && <Loader size="md" />}

            {!loading && isValid && convertedAmount != null && (
                <ResultCard
                    amount={parseFloat(amount)}
                    baseCurrency={base}
                    targetCurrency={target}
                    convertedAmount={convertedAmount}
                    rate={rate}
                    timestamp={timestamp}
                    trend={trend}
                    loading={loading}
                />
            )}

            {/* 7-day trend sparkline */}
            {historyData && historyData.length >= 2 && (
                <div className={styles.trendSection}>
                    <RateTrend historyData={historyData} />
                </div>
            )}

            {/* Conversion history */}
            <div className={styles.historySection}>
                <HistoryList />
            </div>
        </div>
    );
}

export default ConverterPage;
