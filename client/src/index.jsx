/**
 * index.jsx — Application entry point.
 *
 * Wraps the root <App /> component in the required providers:
 *   - BrowserRouter  (client-side routing)
 *   - ThemeProvider   (light / dark theme)
 *   - CurrencyProvider (global currency state)
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <CurrencyProvider>
                    <App />
                </CurrencyProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
