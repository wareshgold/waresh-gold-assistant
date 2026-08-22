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
       ┌──────────────────────────────────────────────┐
       │ Telegram │ Web │ Mobile │ REST API │ CRM     │
       └──────────────────────┬───────────────────────┘
                              │
                              ▼
                    Application Layer
       ┌──────────────────────────────────────────────┐
       │ Use Cases │ Workflows │ AI Orchestration      │
       │ Jobs      │ Tool Execution │ Business Services│
       └──────────────────────┬───────────────────────┘
                              │
                              ▼
                       Domain Layer
       ┌──────────────────────────────────────────────┐
       │ Gold Rules │ Calculations │ Entities          │
       │ Value Objects │ Strategy Logic │ Contracts     │
       └──────────────────────┬───────────────────────┘
                              │
                              ▼
                   Infrastructure Layer
       ┌──────────────────────────────────────────────┐
       │ Cloudflare │ D1 │ KV │ External APIs │ AI     │
       │ Telegram │ Storage │ Market Data Providers    │
       └──────────────────────────────────────────────┘
```

### Core architectural rule

The Gold Domain Engine must remain independent from:

- Telegram
- HTTP
- Databases
- Cloudflare
- AI providers
- External market APIs

External systems are adapters around the core platform.

This keeps the financial logic portable, testable, and reusable across future products.

---

## 🤖 Waresh AI

Waresh AI is an orchestration layer on top of the Gold Platform.

Its job is to understand intent, select trusted tools, execute business workflows, and explain verified results to users.

```text
User Request
     ↓
AI Service
     ↓
AI Model / Local Router
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

### AI does NOT own financial logic

The AI layer must never calculate or invent financial values itself.

For example:

```text
User: "قیمت طلا چنده؟"

AI
 ↓
Gold Price Tool
 ↓
Market Price Provider
 ↓
Trusted Gold Result
 ↓
AI explains the result
```

Current AI capabilities include:

- Local deterministic tool routing
- Current 18K gold price lookup
- Current mithqal price lookup
- Gold calculation tool execution
- Reverse labor calculation
- Gold bubble tool routing
- Native AI tool calls
- Legacy tool-call compatibility
- Tool input validation
- Conversation/session-oriented AI flow

The local router is intentionally deterministic for high-confidence requests so simple market questions do not need to depend on an external model response.

---

## 🟡 Gold Engine

The Gold Engine contains trusted domain-level financial calculations and rules.

Implemented domain concepts include:

- Money
- Gold Price
- Gold Weight
- Labor
- Profit
- Tax
- Discount
- Market Price
- Gold Bubble

Gold bubble analysis separates the market price from the calculated intrinsic value and exposes the bubble amount and percentage instead of confusing the intrinsic price with the bubble itself.

---

## 📊 Market Features

### Current Market Price

Provides current market information such as:

- 18K gold price
- Mithqal price
- Ounce price
- Market source metadata

### Gold Bubble

The platform calculates the difference between the market gold price and its calculated intrinsic reference value.

The AI layer routes bubble questions to the dedicated bubble tool so the result is not mistaken for a normal gold price.

### Analytics & History

The platform includes foundations for:

- Market analytics
- Price history
- Scheduled market reports
- Periodic reporting preferences

---

## 🧮 Gold Calculations

Supported calculation workflows include:

- Gold price calculation
- Labor / wage calculation
- Profit and tax handling
- Discount handling
- Reverse labor calculation
- Calculation history

Business calculations are delegated to domain/application services rather than implemented inside Telegram handlers or AI prompts.

---

## 🔔 Alerts & Reports

The platform supports user-oriented market automation such as:

- Configurable price alerts
- Periodic market reports
- Report scheduling preferences
- Market summary generation

The report system is designed as an application workflow so future interfaces can reuse it without duplicating business logic.

---

## ⭐ VIP & SP2L

VIP capabilities are being developed as a separate access-controlled part of the platform.

The roadmap includes:

- VIP access management
- VIP-only tools
- SP2L strategy signal engine
- Signal evaluation
- Signal publishing
- AI access to strategy information

SP2L is intended to live in the **domain layer** and remain independent from Telegram and AI. Telegram and AI should only act as interfaces to trusted strategy services.

> The current branch is actively preparing the VIP/SP2L production architecture; SP2L should not be treated as production-complete until its real market-data evaluation and publishing workflow are fully verified.

---

## 📱 Telegram Interface

Telegram is currently the first presentation layer.

Available commands include:

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

The bot also supports conversational AI flows where users can enter an AI session and ask questions without repeating `/ai`.

---

## ☁️ Deployment

The first deployment target is **Cloudflare Workers**.

Current infrastructure is designed around the Cloudflare ecosystem:

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

The project uses TypeScript with Vitest for automated testing.

Typical validation commands:

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm exec wrangler deploy
```

The project follows these development standards:

- Clean Architecture
- SOLID principles
- Domain-driven design
- Strong separation of concerns
- Dependency inversion
- Testable business logic
- Deterministic financial calculations
- No duplicated domain rules
- Interface-independent application services

Before production deployment, changes should pass tests, TypeScript validation, and deployment checks.

---

## 📁 Architectural Boundaries

A simplified source structure is organized around responsibility rather than framework concerns:

```text
src/
├── domain/
│   ├── gold/
│   ├── market/
│   ├── strategy/
│   └── ...
│
├── application/
│   ├── ai/
│   ├── gold/
│   ├── jobs/
│   ├── telegram/
│   └── ...
│
├── infrastructure/
│   ├── cloudflare/
│   ├── market/
│   ├── persistence/
│   ├── ai/
│   └── ...
│
└── interfaces/
    └── ...
```

The exact module structure evolves with the platform, but the dependency direction remains the important constraint:

```text
Interfaces → Application → Domain
Infrastructure → Application/Domain contracts
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

Financial calculations are treated as trusted business logic.

Important principles:

1. AI must not invent market values.
2. AI must not replace domain calculations.
3. Market values must come from trusted market tools/providers.
4. Tool results are the source of truth for AI responses.
5. Business rules must remain outside Telegram handlers.
6. External providers must be replaceable through abstractions.

This separation is especially important because Waresh Gold is intended to evolve into business infrastructure, not just a conversational bot.

---

## 📌 Current Development Checkpoint

Current development branch:

```text
fix/vip-sp2l-production-readiness
```

Current verified checkpoint:

```text
Commit: ae2f3f4
Tag: checkpoint/ai-sp2l-vip-market-bubble-ready-2026-08-22
```

At this checkpoint, the project has:

- 52 test files passing
- 151 tests passing
- TypeScript validation passing
- Clean working tree
- AI market-price routing
- AI mithqal routing
- AI gold-bubble routing
- Professional Telegram help and market-report UX

The checkpoint is intended as a safe rollback point before the next major VIP/SP2L and AI-session development phase.

---

## 🚀 Project Direction

Waresh Gold Assistant is intentionally being built as a **platform first and Telegram bot second**.

The core principle is simple:

> **Build the Gold Business Core once. Expose it everywhere.**

Telegram is only the first door into the platform.

---

## 📄 License

This project is currently private/proprietary software developed for the Waresh Gold platform.
