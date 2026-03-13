/**
 * SettingsPage.jsx — User preferences: default currencies, theme toggle,
 * decimal places, with persistence to localStorage via CurrencyContext
 * and ThemeContext.
 */

import React, { useState, useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import currencyList from "../utils/currencyList";
import CurrencySelector from "../components/CurrencySelector";
import styles from "./SettingsPage.module.css";

const DECIMAL_OPTIONS = [0, 1, 2, 3, 4, 5, 6];

function SettingsPage() {
    const {
        defaultBase,
        defaultTarget,
        decimalPlaces,
        setDefaults,
        setDecimalPlaces,
    } = useCurrency();
    const { theme, toggleTheme } = useTheme();

    // Local form state so the user can review before saving
    const [localBase, setLocalBase] = useState(defaultBase);
    const [localTarget, setLocalTarget] = useState(defaultTarget);
    const [localDecimals, setLocalDecimals] = useState(decimalPlaces);
    const [saved, setSaved] = useState(false);

    // Sync local state when context values change (e.g. on first mount)
    useEffect(() => {
        setLocalBase(defaultBase);
        setLocalTarget(defaultTarget);
        setLocalDecimals(decimalPlaces);
    }, [defaultBase, defaultTarget, decimalPlaces]);

    const handleSave = (e) => {
        e.preventDefault();
        setDefaults(localBase, localTarget);
        setDecimalPlaces(localDecimals);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>
                    Customize your RateShift experience
                </p>
            </header>

            <form className={styles.card} onSubmit={handleSave}>
                {/* Default base currency */}
                <div className={styles.field}>
                    <CurrencySelector
                        label="Default base currency"
                        value={localBase}
                        onChange={setLocalBase}
                        currencies={currencyList}
                    />
                </div>

                {/* Default target currency */}
                <div className={styles.field}>
                    <CurrencySelector
                        label="Default target currency"
                        value={localTarget}
                        onChange={setLocalTarget}
                        currencies={currencyList}
                    />
                </div>

                {/* Theme toggle */}
                <div className={styles.field}>
                    <span className={styles.label}>Theme</span>
                    <button
                        type="button"
                        className={styles.themeBtn}
                        onClick={toggleTheme}
                    >
                        {theme === "light"
                            ? "\u263E  Switch to Dark Mode"
                            : "\u2600  Switch to Light Mode"}
                    </button>
                    <p className={styles.hint}>
                        Currently using <strong>{theme}</strong> mode.
                    </p>
                </div>

                {/* Decimal places */}
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="decimal-select">
                        Decimal places
                    </label>
                    <select
                        id="decimal-select"
                        className={styles.select}
                        value={localDecimals}
                        onChange={(e) =>
                            setLocalDecimals(Number(e.target.value))
                        }
                    >
                        {DECIMAL_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <p className={styles.hint}>
                        Controls how many decimal digits are shown in conversion
                        results.
                    </p>
                </div>

                {/* Save button */}
                <button type="submit" className={styles.saveBtn}>
                    {saved ? "Saved!" : "Save Settings"}
                </button>
            </form>
        </div>
    );
}

export default SettingsPage;
