/**
 * Navbar.jsx — Fixed top navigation bar with glassmorphism styling,
 * dark-mode toggle, and responsive mobile hamburger menu.
 */

import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
    { to: "/", label: "Converter" },
    { to: "/about", label: "About" },
    { to: "/settings", label: "Settings" },
];

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggleMobile = useCallback(() => {
        setMobileOpen((prev) => !prev);
    }, []);

    const handleLinkClick = useCallback(() => {
        setMobileOpen(false);
    }, []);

    const linkClass = ({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : ""}`;

    return (
        <nav
            className={styles.navbar}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className={styles.inner}>
                {/* Logo */}
                <NavLink
                    to="/"
                    className={styles.logo}
                    onClick={handleLinkClick}
                >
                    RateShift
                </NavLink>

                {/* Desktop links */}
                <ul className={styles.links}>
                    {NAV_LINKS.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={to === "/"}
                                className={linkClass}
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className={styles.actions}>
                    {/* Dark mode toggle */}
                    <button
                        type="button"
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? "\u2600" : "\uD83C\uDF19"}
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className={styles.hamburger}
                        onClick={handleToggleMobile}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                    >
                        {"\u2630"}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileOpen && (
                <ul className={styles.mobileMenu}>
                    {NAV_LINKS.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) =>
                                    `${styles.mobileLink} ${isActive ? styles.active : ""}`
                                }
                                onClick={handleLinkClick}
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}

export default Navbar;
