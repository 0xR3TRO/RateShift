/**
 * CurrencySelector.jsx — Searchable currency dropdown with keyboard
 * navigation, ARIA attributes, and click-outside-to-close behavior.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import defaultCurrencies from "../utils/currencyList";
import styles from "./CurrencySelector.module.css";

function CurrencySelector({
    label,
    value,
    onChange,
    currencies = defaultCurrencies,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    // Resolve the currently selected currency object
    const selected = currencies.find((c) => c.code === value) || null;

    // Filter currencies by search term (case insensitive, matches code or name)
    const filtered = currencies.filter((c) => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return (
            c.code.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
        );
    });

    // Close dropdown when clicking outside the component
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset highlight index when the search term changes
    useEffect(() => {
        setHighlightIndex(-1);
    }, [searchTerm]);

    // Scroll the highlighted option into view
    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[role="option"]');
            if (items[highlightIndex]) {
                items[highlightIndex].scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightIndex]);

    const handleSelect = useCallback(
        (code) => {
            onChange(code);
            setIsOpen(false);
            setSearchTerm("");
        },
        [onChange],
    );

    const handleKeyDown = (event) => {
        if (!isOpen) {
            if (event.key === "ArrowDown" || event.key === "Enter") {
                event.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setHighlightIndex((prev) =>
                    prev < filtered.length - 1 ? prev + 1 : 0,
                );
                break;
            case "ArrowUp":
                event.preventDefault();
                setHighlightIndex((prev) =>
                    prev > 0 ? prev - 1 : filtered.length - 1,
                );
                break;
            case "Enter":
                event.preventDefault();
                if (highlightIndex >= 0 && filtered[highlightIndex]) {
                    handleSelect(filtered[highlightIndex].code);
                }
                break;
            case "Escape":
                event.preventDefault();
                setIsOpen(false);
                setSearchTerm("");
                break;
            default:
                break;
        }
    };

    const handleTriggerClick = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {label && (
                <label className={styles.label} id={`${label}-label`}>
                    {label}
                </label>
            )}

            {/* Trigger button */}
            <button
                type="button"
                className={styles.trigger}
                onClick={handleTriggerClick}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${label}-label` : undefined}
            >
                {selected ? (
                    <span className={styles.selectedValue}>
                        <span className={styles.flag}>{selected.flag}</span>
                        <span>{selected.code}</span>
                    </span>
                ) : (
                    <span className={styles.placeholder}>Select currency</span>
                )}
                <span
                    className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
                >
                    &#9662;
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className={styles.dropdown}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        className={styles.search}
                        placeholder="Search currencies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label="Search currencies"
                        autoComplete="off"
                    />
                    <ul
                        className={styles.list}
                        ref={listRef}
                        role="listbox"
                        aria-label="Currency options"
                    >
                        {filtered.length === 0 && (
                            <li className={styles.empty}>
                                No currencies found
                            </li>
                        )}
                        {filtered.map((currency, index) => (
                            <li
                                key={currency.code}
                                role="option"
                                aria-selected={currency.code === value}
                                className={`${styles.option} ${
                                    currency.code === value
                                        ? styles.selected
                                        : ""
                                } ${index === highlightIndex ? styles.highlighted : ""}`}
                                onClick={() => handleSelect(currency.code)}
                                onMouseEnter={() => setHighlightIndex(index)}
                            >
                                <span className={styles.flag}>
                                    {currency.flag}
                                </span>
                                <span className={styles.code}>
                                    {currency.code}
                                </span>
                                <span className={styles.name}>
                                    {currency.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CurrencySelector;
