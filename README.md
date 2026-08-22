# 🟡 Waresh Gold Assistant

> AI-powered Gold Business Platform for the Iranian gold & jewelry market.

Waresh Gold Assistant is the foundation of a larger digital infrastructure for gold businesses in Iran. Telegram is the first interface, not the product boundary.

The platform is being designed so the same trusted business logic can power future **Website, Mobile Apps, REST APIs, Admin Dashboard, CRM, customer support, AI assistants, and automation services**.

**Author:** Ali Mirzaei  
**Copyright:** © 2026 Waresh Gold / Ali Mirzaei

---

## 📜 License & Usage

This repository is **proprietary software** owned by **Waresh Gold / Ali Mirzaei**.

Unless explicit written permission is granted by the copyright holder, the source code may not be copied, modified, distributed, sublicensed, sold, or used as the basis of another commercial product.

Viewing the source code on GitHub does not grant permission to reuse it.

See [`LICENSE`](./LICENSE) for the full terms.

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
- Strategy and signal services

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

The Gold Domain Engine must remain independent from Telegram, HTTP, databases, Cloudflare, AI providers, and external market APIs.

External systems are adapters around the core platform. This keeps the financial logic portable, testable, and reusable across future products.

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

The AI layer must never calculate or invent financial values itself.

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

Implemented concepts include:

- Money
- Gold Price
- Gold Weight
- Labor
- Profit
- Tax
- Discount
- Market Price
- Gold Bubble

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

## ⭐ VIP & Strategies

VIP capabilities are being developed as a separate access-controlled part of the platform.

The strategy architecture is intentionally generic so additional proprietary strategies can be added without exposing their internal names or implementation details.

Strategies are identified internally by neutral identifiers such as:

```text
Strategy A
Strategy B
Strategy C
...
```

The strategy engine is designed to live in the **domain layer** and remain independent from Telegram and AI. Interfaces should expose only the information required by authorized users.

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
/strategy       Latest authorized strategy signal
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

Development standards:

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
│   └── ...
│
└── interfaces/
    └── ...
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
- [ ] Complete strategy engine
- [ ] Real market-data evaluation pipeline
- [ ] Signal publishing workflow
- [ ] VIP AI strategy assistant
- [ ] Additional proprietary strategies

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
7. Proprietary strategy names and implementation details should not be exposed through public interfaces.

---

## 🚀 Project Direction

Waresh Gold Assistant is intentionally being built as a **platform first and Telegram bot second**.

> **Build the Gold Business Core once. Expose it everywhere.**

Telegram is only the first door into the platform.

---

## 👤 Author

**Ali Mirzaei**  
Founder / Developer — Waresh Gold

© 2026 Waresh Gold. All rights reserved.
