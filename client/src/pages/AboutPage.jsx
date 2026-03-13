/**
 * AboutPage.jsx — Project overview, feature list, and tech stack credits.
 */

import React from "react";
import styles from "./AboutPage.module.css";

function AboutPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>About RateShift</h1>
                <p className={styles.subtitle}>
                    A fast, modern currency converter built for everyday use.
                </p>
            </header>

            {/* Description */}
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>What is RateShift?</h2>
                <p className={styles.text}>
                    RateShift is an open-source currency converter that delivers
                    real-time exchange rates for over 30 major world currencies.
                    Whether you are traveling abroad, managing international
                    invoices, or just curious about foreign exchange, RateShift
                    gives you accurate conversions in an instant.
                </p>
            </section>

            {/* Features */}
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Features</h2>
                <ul className={styles.list}>
                    <li>
                        Real-time exchange rates from a reliable data provider
                    </li>
                    <li>
                        Support for 30+ major currencies with searchable
                        selectors
                    </li>
                    <li>7-day trend sparkline for any currency pair</li>
                    <li>Conversion history saved locally in the browser</li>
                    <li>Light and dark themes with smooth transitions</li>
                    <li>
                        Fully responsive design for mobile, tablet, and desktop
                    </li>
                    <li>
                        Accessible UI with keyboard navigation and ARIA
                        attributes
                    </li>
                    <li>Configurable decimal precision (0 to 6 places)</li>
                </ul>
            </section>

            {/* Tech stack */}
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Tech Stack</h2>
                <div className={styles.techGrid}>
                    <div className={styles.techItem}>
                        <h3 className={styles.techLabel}>Frontend</h3>
                        <p className={styles.techValue}>
                            React 18, React Router, CSS Modules
                        </p>
                    </div>
                    <div className={styles.techItem}>
                        <h3 className={styles.techLabel}>Backend</h3>
                        <p className={styles.techValue}>
                            Node.js, Express, REST API
                        </p>
                    </div>
                    <div className={styles.techItem}>
                        <h3 className={styles.techLabel}>Data</h3>
                        <p className={styles.techValue}>
                            Live exchange rates via third-party API
                        </p>
                    </div>
                    <div className={styles.techItem}>
                        <h3 className={styles.techLabel}>Tooling</h3>
                        <p className={styles.techValue}>
                            Create React App, Concurrently, dotenv
                        </p>
                    </div>
                </div>
            </section>

            {/* Credits */}
            <section className={styles.card}>
                <h2 className={styles.cardTitle}>Credits</h2>
                <p className={styles.text}>
                    Built with care using open-source technologies. Exchange
                    rate data provided by public foreign-exchange APIs. Emoji
                    flags courtesy of the Unicode standard.
                </p>
            </section>
        </div>
    );
}

export default AboutPage;
