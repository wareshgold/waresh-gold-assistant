# 🟡 Waresh Gold Assistant

> AI-powered Gold Business Platform for the Iranian gold & jewelry market.

Waresh Gold Assistant is the foundation of a larger digital infrastructure for gold businesses in Iran. Telegram is the first interface, not the product boundary.

The platform is being designed so the same trusted business logic can power future **Website, Mobile Apps, REST APIs, Admin Dashboard, CRM, customer support, AI assistants, and automation services**.

---

## 🎯 Vision

Waresh Gold aims to provide a reliable digital platform for the daily operations of gold businesses:

- Live gold market prices
- Gold and invoice calculations
- Reverse gold calculations
- Market analytics
- Gold bubble analysis
- Historical market data
- Price alerts
- Scheduled market reports
- Product and order workflows
- Customer management
- VIP services
- AI-powered customer assistance
- Strategy and signal services such as SP2L

The long-term goal is to build a reusable **Gold Business Platform Core**, rather than a Telegram-only bot.

---

## 🏗️ Architecture

The project follows Clean Architecture and Domain-Driven Design principles.

```text
Interfaces / Presentation
Telegram · Web · Mobile · REST API · CRM
                ↓
Application Layer
Use Cases · Workflows · AI Orchestration · Jobs · Tool Execution
                ↓
Domain Layer
Gold Rules · Calculations · Entities · Value Objects · Strategy Logic
                ↓
Infrastructure Layer
Cloudflare · D1 · KV · External APIs · AI · Market Data Providers
```

### Core architectural rule

The Gold Domain Engine must remain independent from Telegram, HTTP, databases, Cloudflare, AI providers, and external market APIs. External systems are adapters around the core platform.

---

## 🤖 Waresh AI

Waresh AI is an orchestration layer on top of the Gold Platform. It understands intent, selects trusted tools, executes business workflows, and explains verified results.

```text
User Request
    ↓
AI Service / Local Router
    ↓
Tool Selection
    ↓
Tool Execution Engine
    ↓
Gold Domain Services
    ↓
Verified Result
    ↓
AI Response
```

AI does **not** own financial logic and must never invent market values or replace trusted domain calculations.

Current AI capabilities include local deterministic routing for:

- Current 18K gold price
- Current mithqal price
- Gold calculations
- Reverse labor calculation
- Gold bubble analysis
- Tool validation and execution

---

## 🟡 Gold Engine

The Gold Engine contains trusted domain-level financial calculations and rules.

Implemented concepts include Money, Gold Price, Gold Weight, Labor, Profit, Tax, Discount, Market Price, and Gold Bubble.

Gold bubble analysis separates the market price from the calculated intrinsic reference value and exposes the actual bubble amount and percentage.

---

## 📊 Market Features

- Current 18K gold price
- Mithqal price
- Ounce price
- Market analytics
- Price history
- Gold bubble analysis
- Scheduled market reports
- Periodic reporting preferences

---

## 🧮 Gold Calculations

Supported workflows include:

- Gold price calculation
- Labor / wage calculation
- Profit and tax handling
- Discount handling
- Reverse labor calculation
- Calculation history

Business calculations live in domain/application services rather than Telegram handlers or AI prompts.

---

## 🔔 Alerts & Reports

The platform supports:

- Configurable price alerts
- Periodic market reports
- Report scheduling preferences
- Market summary generation

---

## ⭐ VIP & SP2L

VIP capabilities are being developed as a separate access-controlled part of the platform.

The roadmap includes VIP access management, VIP-only tools, the SP2L strategy signal engine, signal evaluation, signal publishing, and AI access to strategy information.

SP2L is intended to live in the **domain layer** and remain independent from Telegram and AI. The current branch is preparing the VIP/SP2L production architecture; SP2L should not be treated as production-complete until its real market-data evaluation and publishing workflow are fully verified.

---

## 📱 Telegram Commands

```text
/start          Start Waresh Gold
/help           Complete command guide
/price          Current gold price
/bubble         Gold bubble analysis
/analytics      Market analytics
/history        Price history
/calc           Gold price calculation
/reverse-labor  Reverse labor calculation
/calc-history   Calculation history
/alerts         Price alerts
/reports        Periodic market reports
/ai             Waresh AI conversation
/vip            VIP access
/sp2l           Latest SP2L signal (VIP)
/exit           Exit current conversation/calculation
```

The bot supports conversational AI sessions where users can enter `/ai` once and continue asking questions without repeating the command.

---

## ☁️ Deployment

The first deployment target is **Cloudflare Workers**.

Infrastructure includes:

- Cloudflare Workers
- Cloudflare D1
- Cloudflare KV
- Wrangler
- Cron Triggers
- Hono
- Drizzle ORM
- Zod

The architecture remains portable so the core business logic can later run on dedicated backend infrastructure without rewriting the domain layer.

---

## 🧪 Development & Quality

The project uses TypeScript and Vitest.

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm exec wrangler deploy
```

Development standards include Clean Architecture, SOLID, domain-driven design, dependency inversion, testable business logic, deterministic financial calculations, and strong separation of concerns.

---

## 📁 Architectural Boundaries

```text
src/
├── domain/
├── application/
├── infrastructure/
└── interfaces/
```

The dependency direction remains:

```text
Interfaces → Application → Domain
Infrastructure → Application / Domain contracts
```

The domain must not depend on presentation or infrastructure technologies.

---

## 🗺️ Roadmap

### Foundation

- [x] Gold domain models and value objects
- [x] Market price providers
- [x] Gold calculation workflows
- [x] Telegram command architecture
- [x] Cloudflare Worker deployment
- [x] Automated test foundation

### AI Foundation

- [x] AI service abstraction
- [x] Local deterministic tool routing
- [x] Tool registry
- [x] Tool execution engine
- [x] Tool input validation
- [x] Current gold price tool
- [x] Mithqal price tool
- [x] Gold calculation tool
- [x] Gold bubble routing
- [ ] Complete production AI conversation/session architecture

### Business Automation

- [x] Price alerts foundation
- [x] Periodic market reports
- [ ] Production-grade scheduling and monitoring
- [ ] Advanced customer workflows
- [ ] CRM integration

### VIP / Strategy

- [ ] Production-ready VIP access control
- [ ] Complete SP2L domain engine
- [ ] Real market-data evaluation pipeline
- [ ] Signal publishing workflow
- [ ] VIP AI strategy assistant

### Platform Expansion

- [ ] REST API
- [ ] Web application
- [ ] Mobile applications
- [ ] Admin dashboard
- [ ] Customer support platform
- [ ] Business automation services

---

## 🔐 Security & Financial Integrity

1. AI must not invent market values.
2. AI must not replace domain calculations.
3. Market values must come from trusted market tools/providers.
4. Tool results are the source of truth for AI responses.
5. Business rules must remain outside Telegram handlers.
6. External providers must be replaceable through abstractions.

---

## 📌 Current Development Checkpoint

```text
Branch: fix/vip-sp2l-production-readiness
Commit: ae2f3f4
Tag: checkpoint/ai-sp2l-vip-market-bubble-ready-2026-08-22
```

Verified at this checkpoint:

- 52 test files passing
- 151 tests passing
- TypeScript validation passing
- Clean working tree
- AI market-price routing
- AI mithqal routing
- AI gold-bubble routing
- Professional Telegram help and market-report UX

---

## 🚀 Project Direction

Waresh Gold Assistant is intentionally being built as a **platform first and Telegram bot second**.

> **Build the Gold Business Core once. Expose it everywhere.**

Telegram is only the first door into the platform.

---

## 📄 License

This project is currently private/proprietary software developed for the Waresh Gold platform.
