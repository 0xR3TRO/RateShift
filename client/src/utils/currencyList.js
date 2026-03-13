/**
 * currencyList.js — Master list of 30 major world currencies.
 *
 * Each entry contains the ISO 4217 code, the English display name,
 * the currency symbol, and an emoji flag for the primary issuing country.
 */

const currencyList = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "\u{1F1FA}\u{1F1F8}" },
    { code: "EUR", name: "Euro", symbol: "\u20AC", flag: "\u{1F1EA}\u{1F1FA}" },
    {
        code: "GBP",
        name: "British Pound",
        symbol: "\u00A3",
        flag: "\u{1F1EC}\u{1F1E7}",
    },
    {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "\u00A5",
        flag: "\u{1F1EF}\u{1F1F5}",
    },
    {
        code: "CHF",
        name: "Swiss Franc",
        symbol: "CHF",
        flag: "\u{1F1E8}\u{1F1ED}",
    },
    {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "CA$",
        flag: "\u{1F1E8}\u{1F1E6}",
    },
    {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        flag: "\u{1F1E6}\u{1F1FA}",
    },
    {
        code: "NZD",
        name: "New Zealand Dollar",
        symbol: "NZ$",
        flag: "\u{1F1F3}\u{1F1FF}",
    },
    {
        code: "CNY",
        name: "Chinese Yuan",
        symbol: "\u00A5",
        flag: "\u{1F1E8}\u{1F1F3}",
    },
    {
        code: "INR",
        name: "Indian Rupee",
        symbol: "\u20B9",
        flag: "\u{1F1EE}\u{1F1F3}",
    },
    {
        code: "BRL",
        name: "Brazilian Real",
        symbol: "R$",
        flag: "\u{1F1E7}\u{1F1F7}",
    },
    {
        code: "MXN",
        name: "Mexican Peso",
        symbol: "MX$",
        flag: "\u{1F1F2}\u{1F1FD}",
    },
    {
        code: "KRW",
        name: "South Korean Won",
        symbol: "\u20A9",
        flag: "\u{1F1F0}\u{1F1F7}",
    },
    {
        code: "SGD",
        name: "Singapore Dollar",
        symbol: "S$",
        flag: "\u{1F1F8}\u{1F1EC}",
    },
    {
        code: "HKD",
        name: "Hong Kong Dollar",
        symbol: "HK$",
        flag: "\u{1F1ED}\u{1F1F0}",
    },
    {
        code: "NOK",
        name: "Norwegian Krone",
        symbol: "kr",
        flag: "\u{1F1F3}\u{1F1F4}",
    },
    {
        code: "SEK",
        name: "Swedish Krona",
        symbol: "kr",
        flag: "\u{1F1F8}\u{1F1EA}",
    },
    {
        code: "DKK",
        name: "Danish Krone",
        symbol: "kr",
        flag: "\u{1F1E9}\u{1F1F0}",
    },
    {
        code: "PLN",
        name: "Polish Zloty",
        symbol: "z\u0142",
        flag: "\u{1F1F5}\u{1F1F1}",
    },
    {
        code: "CZK",
        name: "Czech Koruna",
        symbol: "K\u010D",
        flag: "\u{1F1E8}\u{1F1FF}",
    },
    {
        code: "HUF",
        name: "Hungarian Forint",
        symbol: "Ft",
        flag: "\u{1F1ED}\u{1F1FA}",
    },
    {
        code: "TRY",
        name: "Turkish Lira",
        symbol: "\u20BA",
        flag: "\u{1F1F9}\u{1F1F7}",
    },
    {
        code: "ZAR",
        name: "South African Rand",
        symbol: "R",
        flag: "\u{1F1FF}\u{1F1E6}",
    },
    {
        code: "THB",
        name: "Thai Baht",
        symbol: "\u0E3F",
        flag: "\u{1F1F9}\u{1F1ED}",
    },
    {
        code: "IDR",
        name: "Indonesian Rupiah",
        symbol: "Rp",
        flag: "\u{1F1EE}\u{1F1E9}",
    },
    {
        code: "MYR",
        name: "Malaysian Ringgit",
        symbol: "RM",
        flag: "\u{1F1F2}\u{1F1FE}",
    },
    {
        code: "PHP",
        name: "Philippine Peso",
        symbol: "\u20B1",
        flag: "\u{1F1F5}\u{1F1ED}",
    },
    {
        code: "TWD",
        name: "New Taiwan Dollar",
        symbol: "NT$",
        flag: "\u{1F1F9}\u{1F1FC}",
    },
    {
        code: "AED",
        name: "UAE Dirham",
        symbol: "AED",
        flag: "\u{1F1E6}\u{1F1EA}",
    },
    {
        code: "SAR",
        name: "Saudi Riyal",
        symbol: "SAR",
        flag: "\u{1F1F8}\u{1F1E6}",
    },
];

export default currencyList;
