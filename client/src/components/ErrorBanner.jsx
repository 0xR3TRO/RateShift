/**
 * ErrorBanner.jsx — Dismissible error banner with slide-down animation.
 */

import React from "react";
import styles from "./ErrorBanner.module.css";

function ErrorBanner({ message, onDismiss }) {
    if (!message) return null;

    return (
        <div className={styles.banner} role="alert">
            <span className={styles.icon} aria-hidden="true">
                &#9888;
            </span>
            <p className={styles.message}>{message}</p>
            {onDismiss && (
                <button
                    type="button"
                    className={styles.close}
                    onClick={onDismiss}
                    aria-label="Dismiss error"
                >
                    &#10005;
                </button>
            )}
        </div>
    );
}

export default ErrorBanner;
