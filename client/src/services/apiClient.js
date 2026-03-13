/**
 * apiClient.js — Lightweight fetch wrapper for the RateShift API.
 *
 * Uses the native Fetch API (no Axios dependency). Base URL is resolved from
 * the REACT_APP_API_BASE_URL environment variable or falls back to '/api'
 * (which is proxied to the Express server during development).
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

/**
 * Build a URL with query parameters.
 *
 * @param {string} endpoint — The API endpoint path (e.g. '/rates').
 * @param {Object} [params] — Key-value pairs for the query string.
 * @returns {string} The fully qualified URL string.
 */
function buildUrl(endpoint, params) {
    const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

/**
 * Perform a GET request against the API.
 *
 * @param {string} endpoint — The API endpoint path.
 * @param {Object} [params] — Optional query string parameters.
 * @returns {Promise<any>} The parsed JSON response body.
 * @throws {Error} On network failure or non-OK HTTP status.
 */
export async function get(endpoint, params) {
    const url = buildUrl(endpoint, params);

    let response;
    try {
        response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
    } catch (networkError) {
        throw new Error(
            "Network error: unable to reach the server. Please check your connection.",
        );
    }

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid response from server.");
    }

    if (!response.ok) {
        const message =
            (data && data.error) ||
            (data && data.message) ||
            `Request failed with status ${response.status}`;
        throw new Error(message);
    }

    return data;
}

const apiClient = { get };
export default apiClient;
