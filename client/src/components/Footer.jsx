/**
 * Footer.jsx — Simple site footer with attribution text.
 */

import React from "react";
import styles from "./Footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <span>Built with React &amp; Express</span>
            <span className={styles.separator}>&bull;</span>
            <span>RateShift &copy; 2024</span>
        </footer>
    );
}

export default Footer;
