/**
 * Loader.jsx — Spinning loader indicator with configurable size.
 */

import React from "react";
import styles from "./Loader.module.css";

const SIZE_MAP = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

function Loader({ size = "md" }) {
    const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

    return (
        <div className={styles.container} role="status">
            <div className={`${styles.spinner} ${sizeClass}`} />
            <span className={styles.visuallyHidden}>Loading...</span>
        </div>
    );
}

export default Loader;
