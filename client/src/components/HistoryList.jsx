/**
 * HistoryList.jsx — Displays the user's recent conversion history pulled
 * from CurrencyContext, with a clear-all button and empty-state message.
 */

import React from "react";
import { useCurrency } from "../context/CurrencyContext";
import { formatNumber } from "../utils/formatNumber";
import styles from "./HistoryList.module.css";

/**
 * Format a timestamp string into a concise, human-readable date/time.
 *
 * @param {string} timestamp — ISO 8601 date string.
 * @returns {string}
 */
function formatTimestamp(timestamp) {
    if (!timestamp) return "";

    try {
        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(timestamp));
    } catch {
        return String(timestamp);
    }
}

/**
 * HistoryList — Renders the conversion history stored in CurrencyContext.
 * Shows an empty-state message when no conversions exist and a clear-all
 * button when history contains entries.
 */
function HistoryList() {
    const { conversionHistory, clearHistory } = useCurrency();

    const hasHistory = conversionHistory && conversionHistory.length > 0;

    return (
        <div className={styles.container}>
            {/* Header row */}
            <div className={styles.header}>
                <h2 className={styles.title}>History</h2>
                {hasHistory && (
                    <button
                        className={styles.clearButton}
                        onClick={clearHistory}
                        type="button"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* History items or empty state */}
            {hasHistory ? (
                <ul className={styles.list}>
                    {conversionHistory.map((entry) => (
                        <li key={entry.id} className={styles.item}>
                            <p className={styles.conversionText}>
                                {formatNumber(entry.amount, 2)}{" "}
                                {entry.baseCurrency} &rarr;{" "}
                                {formatNumber(entry.convertedAmount, 2)}{" "}
                                {entry.targetCurrency}
                            </p>
                            {entry.timestamp && (
                                <p className={styles.timestamp}>
                                    {formatTimestamp(entry.timestamp)}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.emptyState}>
                    No conversions yet. Start converting to build your history.
                </p>
            )}
        </div>
    );
}

export default HistoryList;
