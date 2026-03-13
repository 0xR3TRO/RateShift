/**
 * RateTrend.jsx — Mini SVG sparkline chart that visualizes exchange rate
 * history over a recent window (e.g. 7 days) with a percentage change badge.
 */

import React, { useMemo } from "react";
import styles from "./RateTrend.module.css";

const SVG_WIDTH = 200;
const SVG_HEIGHT = 60;
const PADDING = 4;

/**
 * Convert an array of rate values into SVG polyline point strings.
 *
 * @param {number[]} rates — Raw rate values.
 * @returns {string} A space-separated list of "x,y" pairs.
 */
function buildLinePoints(rates) {
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1; // avoid division by zero when all rates equal

    const usableHeight = SVG_HEIGHT - PADDING * 2;
    const step = SVG_WIDTH / (rates.length - 1);

    return rates
        .map((rate, index) => {
            const x = index * step;
            const y =
                PADDING + usableHeight - ((rate - min) / range) * usableHeight;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
}

/**
 * Build the closed polygon points for the filled area beneath the sparkline.
 * Takes the line points and closes the shape along the bottom edge.
 *
 * @param {string} linePoints — The polyline points string.
 * @returns {string} A space-separated list of "x,y" pairs forming a polygon.
 */
function buildAreaPoints(linePoints) {
    return `0,${SVG_HEIGHT} ${linePoints} ${SVG_WIDTH},${SVG_HEIGHT}`;
}

/**
 * Calculate the percentage change between the first and last rate.
 *
 * @param {number} first — First rate value.
 * @param {number} last  — Last rate value.
 * @returns {number} Percentage change.
 */
function calcPercentChange(first, last) {
    if (!first || first === 0) return 0;
    return ((last - first) / first) * 100;
}

/**
 * RateTrend — Renders a small SVG sparkline of historical exchange rates
 * with a "7-day trend" label and a percentage change badge.
 *
 * @param {object}   props
 * @param {Array<{ date: string, rate: number }>} props.historyData — Rate history.
 */
function RateTrend({ historyData }) {
    // Bail out early when there is no data to render.
    if (!historyData || historyData.length === 0) {
        return null;
    }

    const rates = useMemo(
        () => historyData.map((entry) => entry.rate),
        [historyData],
    );

    const linePoints = useMemo(() => buildLinePoints(rates), [rates]);

    const areaPoints = useMemo(() => buildAreaPoints(linePoints), [linePoints]);

    const percentChange = useMemo(
        () => calcPercentChange(rates[0], rates[rates.length - 1]),
        [rates],
    );

    const isPositive = percentChange >= 0;

    return (
        <div className={styles.container}>
            {/* Sparkline chart */}
            <div className={styles.chartWrapper}>
                <svg
                    className={styles.svg}
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="7-day rate trend chart"
                >
                    {/* Filled area beneath the line */}
                    <polygon
                        points={areaPoints}
                        fill="var(--color-primary)"
                        fillOpacity="0.1"
                    />

                    {/* Sparkline */}
                    <polyline
                        points={linePoints}
                        stroke="var(--color-primary)"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Footer: label + badge */}
            <div className={styles.footer}>
                <span className={styles.label}>7-day trend</span>
                <span
                    className={`${styles.badge} ${
                        isPositive ? styles.badgePositive : styles.badgeNegative
                    }`}
                >
                    {isPositive ? "+" : ""}
                    {percentChange.toFixed(2)}%
                </span>
            </div>
        </div>
    );
}

export default RateTrend;
