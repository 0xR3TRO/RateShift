# RateShift -- Project Overview

## Introduction

RateShift is a full-stack, real-time currency converter application built as a monorepo with a **React** frontend and a **Node.js/Express** backend. The project is designed to serve as both a portfolio showcase and a production-ready reference implementation for modern web development practices.

The application fetches live exchange rates from configurable external providers, performs instant conversions with smart debouncing, and presents results through a clean, responsive user interface. A built-in mock provider allows development and demonstrations without any external API dependency.

## Goals

- **Provide instant, accurate currency conversions** powered by reliable exchange rate data from trusted providers.
- **Deliver a clean, modern UI** that feels polished on every device, from mobile phones to wide desktop monitors.
- **Maintain a robust API layer** with in-memory caching, rate limiting, and comprehensive error handling to ensure reliability under real-world conditions.
- **Enable an extensible architecture** that makes it straightforward to add new currencies, swap providers, or integrate additional features.

## Key Features

| Feature                  | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Real-time exchange rates | Configurable provider support (ExchangeRate-API, OpenExchangeRates, or built-in mock). |
| Instant conversion       | Smart debouncing prevents excessive API calls while keeping the UI responsive.         |
| 30+ currencies           | A curated list of major world currencies, each with ISO code, symbol, and flag.        |
| Conversion history       | Recent conversions persisted in `localStorage` for quick reference across sessions.    |
| 7-day rate trends        | Sparkline-style visualization showing the directional trend and percentage change.     |
| Dark / light theme       | Full dark mode support with system-aware defaults and manual toggle.                   |
| Mobile-first design      | Responsive layouts that adapt gracefully to every screen size.                         |
| Server-side caching      | In-memory cache with configurable TTL reduces external API calls and improves latency. |
| Rate limiting            | Express middleware protects the backend against abuse.                                 |
| Comprehensive errors     | User-friendly error banners on the client; descriptive JSON errors from the server.    |

## Tech Stack

### Frontend

- **React 18** -- component-based UI with hooks and context providers.
- **React Router v6** -- client-side routing.
- **CSS Modules / CSS Custom Properties** -- scoped styling with theme variables.

### Backend

- **Node.js** -- JavaScript runtime for the API server.
- **Express** -- minimal, fast web framework with middleware pipeline.
- **In-memory cache** -- lightweight caching layer with configurable TTL.
- **Morgan** -- HTTP request logging.
- **express-rate-limit** -- sliding-window rate limiting.

### External Services

- **ExchangeRate-API** (v6) -- free tier with 1,500 requests/month.
- **OpenExchangeRates** -- alternative provider with hourly updates.
- **Mock provider** -- deterministic rates for development, CI, and demos.

### Dev Tooling

- **Concurrently** -- run client and server in parallel during development.
- **Nodemon** -- automatic server restart on file changes.
- **Jest + Supertest** -- backend unit and integration tests.
- **React Testing Library** -- frontend component tests.

## Target Audience

- **Developers** looking for a modern, well-structured full-stack project to study or fork.
- **Portfolio reviewers** evaluating code quality, architecture decisions, and documentation.
- **Educators** seeking a real-world example that covers REST APIs, React Context, caching, and responsive design.
