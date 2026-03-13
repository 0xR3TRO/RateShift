/**
 * AmountInput.jsx — Controlled numeric input with currency symbol prefix
 * and inline validation feedback.
 */

import React from "react";
import { validateAmount } from "../utils/validateAmount";
import styles from "./AmountInput.module.css";

function AmountInput({ value, onChange, currency, error: externalError }) {
    // Resolve the currency symbol from the currency object prop
    const symbol = currency?.symbol || "";

    const handleChange = (e) => {
        const raw = e.target.value;

        // Allow empty input so the user can clear the field
        if (raw === "") {
            onChange("");
            return;
        }

        // Only forward values that match a valid numeric pattern while typing
        if (/^\d*\.?\d*$/.test(raw)) {
            onChange(raw);
        }
    };

    // Validate locally unless an external error is already provided
    const { error: validationError } =
        value === "" ? { error: null } : validateAmount(value);
    const displayError = externalError || validationError;

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.inputContainer} ${displayError ? styles.hasError : ""}`}
            >
                {symbol && <span className={styles.symbol}>{symbol}</span>}
                <input
                    type="text"
                    inputMode="decimal"
                    className={styles.input}
                    value={value}
                    onChange={handleChange}
                    placeholder="0.00"
                    autoComplete="off"
                    aria-invalid={!!displayError}
                    aria-describedby={displayError ? "amount-error" : undefined}
                />
            </div>
            {displayError && (
                <p id="amount-error" className={styles.error} role="alert">
                    {displayError}
                </p>
            )}
        </div>
    );
}

export default AmountInput;
