/**
 * App.jsx — Root application component.
 *
 * Sets up page routing, renders the persistent Navbar and Footer, and applies
 * the current theme class to the outermost wrapper so that descendant
 * components can rely on CSS custom-property theming.
 */

import React from "react";
import { Routes, Route } from "react-router-dom";

import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConverterPage from "./pages/ConverterPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";

import styles from "./App.module.css";

function App() {
    const { theme } = useTheme();

    return (
        <div className={`${styles.app} ${styles[theme]}`}>
            <Navbar />
            <main className={styles.main}>
                <Routes>
                    <Route path="/" element={<ConverterPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
