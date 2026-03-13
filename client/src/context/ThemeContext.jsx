/**
 * ThemeContext.jsx — Application-wide light / dark theme management.
 *
 * Persists the user preference in localStorage and applies the data-theme
 * attribute on the document root element so CSS variables cascade correctly.
 */

import React, {
    createContext,
    useContext,
    useEffect,
    useCallback,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext({
    theme: "light",
    toggleTheme: () => {},
});

/**
 * Consume the theme context.
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export function useTheme() {
    return useContext(ThemeContext);
}

/**
 * ThemeProvider — wraps the application and supplies the current theme plus
 * a toggle function to every descendant.
 */
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useLocalStorage("rateshift-theme", "light");

    // Sync the data-theme attribute whenever the theme value changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }, [setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;
