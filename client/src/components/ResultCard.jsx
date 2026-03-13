/**
 * ResultCard.jsx — Displays the conversion result with formatted amounts,
 * exchange rate information, timestamp, and trend indicator.
 */

import React from "react";
import Loader from "./Loader";
import { formatNumber } from "../utils/formatNumber";
import styles from "./ResultCard.module.css";

/**
 * Render a trend badge with directional arrow and percentage.
 *
 * @param {number} trend — Percentage change; positive, negative, or zero.
 * @returns {JSX.Element}
 */
function TrendBadge({ trend }) {
    if (trend > 0) {
        return (
            <span className={`${styles.trend} ${styles.trendUp}`}>
                &#9650; {formatNumber(Math.abs(trend), 2)}%
            </span>
        );
    }

    if (trend < 0) {
        return (
            <span className={`${styles.trend} ${styles.trendDown}`}>
                &#9660; {formatNumber(Math.abs(trend), 2)}%
            </span>
        );
    }

    return (
        <span className={`${styles.trend} ${styles.trendNeutral}`}>
            &mdash; 0.00%
        </span>
    );
}

/**
 * Format a timestamp string into a human-readable date/time.
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
 * ResultCard — Shows the converted amount, exchange rate, last-updated
 * timestamp, and an optional trend indicator.
 *
 * @param {object}  props
 * @param {number}  props.amount          — Original amount entered by the user.
 * @param {string}  props.baseCurrency    — ISO 4217 code of the source currency.
 * @param {string}  props.targetCurrency  — ISO 4217 code of the target currency.
 * @param {number}  props.convertedAmount — Result of the conversion.
 * @param {number}  props.rate            — Exchange rate applied.
 * @param {string}  props.timestamp       — ISO 8601 date string of last update.
 * @param {number}  props.trend           — Percentage change for trend indicator.
 * @param {boolean} props.loading         — Whether the conversion is in progress.
 */
function ResultCard({
    amount,
    baseCurrency,
    targetCurrency,
    convertedAmount,
    rate,
    timestamp,
    trend,
    loading,
}) {
    if (loading) {
        return (
            <div className={styles.card}>
                <Loader />
            </div>
        );
    }

    return (
        <div className={styles.card}>
            {/* Converted amount — primary display */}
            <p className={styles.convertedAmount}>
                {formatNumber(convertedAmount, 2)} {targetCurrency}
            </p>

            {/* Exchange rate line */}
            <p className={styles.rateLine}>
                1 {baseCurrency} = {formatNumber(rate, 4)} {targetCurrency}
            </p>

            {/* Trend indicator */}
            {trend !== undefined && trend !== null && (
                <TrendBadge trend={trend} />
            )}

            {/* Last updated timestamp */}
            {timestamp && (
                <p className={styles.timestamp}>
                    Last updated: {formatTimestamp(timestamp)}
                </p>
            )}
        </div>
    );
}

export default ResultCard;
