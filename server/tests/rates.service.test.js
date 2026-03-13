/**
 * Unit tests for rates.service.js
 *
 * Tests run against the mock provider so no real API calls are made.
 */

// Ensure mock provider is active for tests
process.env.EXCHANGE_PROVIDER = "mock";
process.env.CACHE_TTL_MINUTES = "5";

const ratesService = require("../src/services/rates.service");

describe("rates.service", () => {
    beforeEach(() => {
        ratesService.clearCache();
    });

    describe("getLatestRates()", () => {
        it("should return an object with base, rates, and timestamp", async () => {
            const result = await ratesService.getLatestRates("USD");

            expect(result).toHaveProperty("base", "USD");
            expect(result).toHaveProperty("rates");
            expect(result).toHaveProperty("timestamp");
            expect(typeof result.rates).toBe("object");
            expect(typeof result.timestamp).toBe("number");
        });

        it("should include major currencies in the rates map", async () => {
            const { rates } = await ratesService.getLatestRates("USD");

            expect(rates).toHaveProperty("EUR");
            expect(rates).toHaveProperty("GBP");
            expect(rates).toHaveProperty("JPY");
            expect(rates).toHaveProperty("CHF");
            expect(rates).toHaveProperty("CAD");
        });

        it("should return rate of 1.0 for base currency to itself", async () => {
            const { rates } = await ratesService.getLatestRates("USD");
            expect(rates.USD).toBe(1);
        });

        it("should work for non-USD base currencies", async () => {
            const result = await ratesService.getLatestRates("EUR");

            expect(result.base).toBe("EUR");
            expect(result.rates.EUR).toBe(1);
            expect(result.rates.USD).toBeGreaterThan(1); // 1 EUR > 1 USD
        });

        it("should throw for unsupported currency", async () => {
            await expect(ratesService.getLatestRates("XYZ")).rejects.toThrow(
                /not supported/i,
            );
        });
    });

    describe("getRate()", () => {
        it("should return a rate and timestamp for a valid pair", async () => {
            const result = await ratesService.getRate("USD", "EUR");

            expect(result).toHaveProperty("rate");
            expect(result).toHaveProperty("timestamp");
            expect(typeof result.rate).toBe("number");
            expect(result.rate).toBeGreaterThan(0);
        });

        it("should return correct rate for USD→EUR", async () => {
            const { rate } = await ratesService.getRate("USD", "EUR");

            // Mock rate is 0.9214
            expect(rate).toBeCloseTo(0.9214, 2);
        });

        it("should throw when target currency is invalid", async () => {
            await expect(ratesService.getRate("USD", "XYZ")).rejects.toThrow(
                /not available/i,
            );
        });
    });

    describe("cache behavior", () => {
        it("should store result in cache after first fetch", async () => {
            expect(ratesService._cache.size).toBe(0);

            await ratesService.getLatestRates("USD");

            expect(ratesService._cache.size).toBe(1);
            expect(ratesService._cache.has("latest:USD")).toBe(true);
        });

        it("should serve from cache on subsequent calls", async () => {
            const first = await ratesService.getLatestRates("USD");
            const second = await ratesService.getLatestRates("USD");

            // Should return the exact same object reference (from cache)
            expect(first).toBe(second);
        });

        it("clearCache() should empty the cache map", async () => {
            await ratesService.getLatestRates("USD");
            expect(ratesService._cache.size).toBe(1);

            ratesService.clearCache();

            expect(ratesService._cache.size).toBe(0);
        });
    });
});
