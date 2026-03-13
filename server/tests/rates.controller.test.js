/**
 * Integration tests for API endpoints.
 *
 * Uses supertest to send requests to the Express app directly (no real
 * server port needed). The mock provider is used so no external API calls
 * are made during testing.
 */

process.env.EXCHANGE_PROVIDER = "mock";
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../src/app");
const ratesService = require("../src/services/rates.service");

describe("API Endpoints", () => {
    beforeEach(() => {
        ratesService.clearCache();
    });

    // -----------------------------------------------------------------------
    // GET /api/health
    // -----------------------------------------------------------------------

    describe("GET /api/health", () => {
        it("should return status ok", async () => {
            const res = await request(app).get("/api/health");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", "ok");
            expect(res.body).toHaveProperty("uptime");
            expect(res.body).toHaveProperty("timestamp");
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/rates (convert)
    // -----------------------------------------------------------------------

    describe("GET /api/rates", () => {
        it("should convert USD to EUR with correct shape", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "USD", target: "EUR", amount: 100 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty("base", "USD");
            expect(res.body).toHaveProperty("target", "EUR");
            expect(res.body).toHaveProperty("rate");
            expect(res.body).toHaveProperty("amount", 100);
            expect(res.body).toHaveProperty("convertedAmount");
            expect(res.body).toHaveProperty("timestamp");
            expect(res.body).toHaveProperty("provider", "mock");
        });

        it("should return 400 when base is missing", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ target: "EUR", amount: 100 });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should return 400 when target is missing", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "USD", amount: 100 });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should return 400 when amount is missing", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "USD", target: "EUR" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should return 400 for invalid currency code", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "INVALID", target: "EUR", amount: 100 });

            expect(res.status).toBe(400);
        });

        it("should return 400 for negative amount", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "USD", target: "EUR", amount: -50 });

            expect(res.status).toBe(400);
        });

        it("should handle lowercase currency codes", async () => {
            const res = await request(app)
                .get("/api/rates")
                .query({ base: "usd", target: "eur", amount: 50 });

            expect(res.status).toBe(200);
            expect(res.body.base).toBe("USD");
            expect(res.body.target).toBe("EUR");
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/rates/latest
    // -----------------------------------------------------------------------

    describe("GET /api/rates/latest", () => {
        it("should return all rates for USD", async () => {
            const res = await request(app)
                .get("/api/rates/latest")
                .query({ base: "USD" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty("base", "USD");
            expect(res.body).toHaveProperty("rates");
            expect(typeof res.body.rates).toBe("object");
            expect(res.body.rates).toHaveProperty("EUR");
            expect(res.body.rates).toHaveProperty("GBP");
        });

        it("should return 400 when base is missing", async () => {
            const res = await request(app).get("/api/rates/latest");

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // GET /api/rates/history
    // -----------------------------------------------------------------------

    describe("GET /api/rates/history", () => {
        it("should return 7-day history for USD→EUR", async () => {
            const res = await request(app)
                .get("/api/rates/history")
                .query({ base: "USD", target: "EUR" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty("history");
            expect(Array.isArray(res.body.history)).toBe(true);
            expect(res.body.history).toHaveLength(7);

            // Each entry should have date and rate
            res.body.history.forEach((entry) => {
                expect(entry).toHaveProperty("date");
                expect(entry).toHaveProperty("rate");
                expect(typeof entry.rate).toBe("number");
            });
        });

        it("should return 400 when params are missing", async () => {
            const res = await request(app)
                .get("/api/rates/history")
                .query({ base: "USD" });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
