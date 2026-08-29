# Finly — Executive Product Brief

**Product Name:** Finly (B2B Cashflow Operating System)  
**Tagline:** _"Ditch the Spreadsheets. Master Your Cashflow."_  
**Document Type:** Core Product Brief — The Why & Who  
**Version:** 2.7.0  
**Target Audience:** Non-Accountant Founders, Agency Directors, Consultants, Freelancers, Solopreneurs, and Micro-SMEs

---

## 1. Executive Summary & Product Vision

Small business founders, freelancers, and agency directors overwhelmingly rely on manual spreadsheets to manage their cashflow, invoices, and expenses. Spreadsheets are slow, fragile, lack real-time visibility, introduce dangerous floating-point calculation errors, and force non-accountants to wrestle with complex accounting jargon.

**Finly** is engineered specifically for **non-accountants** to manage their business finances professionally without needing accounting degrees or complex double-entry bookkeeping. It replaces spreadsheets with a blazingly fast, 100% trustworthy B2B cashflow operating system that combines an accurate minor-unit cashbook ledger, real-time live invoice builder with instant math preview, customer/catalog directories, executive analytics, and multi-provider AI Agent integration (Google Gemini, OpenAI ChatGPT, Anthropic Claude, DeepSeek AI, and self-hosted Ollama).

Our core philosophy: **Accuracy & Simplicity are non-negotiable.** Every financial calculation is backed by integer minor-unit arithmetic, strict tenant isolation, zero-jargon user workflows, accessible ShadCN Dialog modal boundaries, and human-in-the-loop AI safety boundaries.

---

## 2. Core Focus: The Why (The Problem)

### 2.1 Fragility & Danger of Spreadsheets for Non-Accountants

- **Formula Breaks & Human Error:** A single broken cell formula or deleted row in Excel/Google Sheets corrupts entire cashflow forecasts without warning.
- **Floating-Point Financial Drift:** Standard spreadsheet/JS floating-point arithmetic (`0.1 + 0.2 = 0.30000000000000004`) causes pennies to drift in client balances, ruining financial trust.
- **Accounting Jargon Confusion:** Traditional accounting tools force users to learn debits, credits, journal entries, and trial balances. Non-accountants just want to know: _"How much money came in, how much went out, and who owes me?"_

### 2.2 Lack of Executive Visibility

- Small business owners lack an instant 5-second snapshot of their financial health.
- They struggle to answer critical operational questions: _"What is my true Operating Expense Ratio (OER) this month?", "Which client invoices are overdue?", "How much liquid cash do I actually have?"_

### 2.3 The AI Trust & Execution Gap

- Business owners want AI assistance for drafting invoices and logging transactions, but dread un-audited AI modifications to their financial records.
- Existing software lacks flexibility, locking businesses into single proprietary AI models without supporting local or enterprise LLM connections.

---

## 3. Core Focus: The Who (Target Market & Buyer Personas)

### 3.1 Primary Target Market

Finly is engineered specifically for **service-based B2B micro-businesses operated by non-accountants**:

- **Agencies & Consultancies:** 2–20 person digital marketing, design, software, and management agencies issuing recurring project invoices.
- **Freelancers & Independent Consultants:** High-value contractors needing fast 3-second cashbook entry and professional client billing.
- **Micro-SMEs & Solopreneurs:** Small business founders requiring strict cashflow tracking without hiring full-time accounting staff.

### 3.2 Ideal Customer Personas

#### Persona 1: Sarah — Creative Agency Director (Non-Accountant)

- **Profile:** Runs an 8-person design agency managing $50k/month in revenue across 15 active clients.
- **Pain Points:** Spends hours assembling monthly invoices, chasing late client payments, and reconciling spreadsheet cashflow.
- **Goals:** Wants automated invoice status tracking, instant PDF generation, clear OER metrics, and a clean professional brand experience for her clients.

#### Persona 2: Alex — Freelance Full-Stack Consultant (Non-Accountant)

- **Profile:** Independent software engineer working with 3 retainer clients.
- **Pain Points:** Forgets to log business expenses, struggles with messy receipt files, and wants a fast mobile-friendly transaction logger.
- **Goals:** Needs a 3-second quick-add expense drawer, receipt upload capability, and multi-model AI API key integration for custom workflows.

---

## 4. Value Proposition & Key Differentiators

| Core Pillar                      | Value Delivered                                                                                                                                        | Unfair Advantage                                                                                       |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Non-Accountant Usability**     | Zero accounting jargon. Color-coded Income vs. Expense ledger with 3-second quick-add drawers and standalone Quick Entry Modal.                        | Intuitive side-drawer workflows and clear status pills (`Paid`, `Unpaid`, `Overdue`, `Draft`).         |
| **100% Trustworthy Ledger**      | Zero floating-point drift. All financial calculations use minor integer minor-units at a fixed scale of 100.                                           | Strict backend invariants with tenant-scoped isolation (`set_config('app.business_id', ...)`).         |
| **Instant Invoice Engine**       | Real-time invoice builder math with instant side-by-side document preview.                                                                             | Snapshot line-item & total calculations written at issue time (`subtotal_in_cents`, `total_in_cents`). |
| **Multi-Provider AI Connection** | Freedom to connect any LLM (Gemini, OpenAI, Claude, DeepSeek, Ollama/vLLM) via API key.                                                                | Human-in-the-loop architecture: AI drafts records; humans explicitly approve before database entry.    |
| **State-of-the-Art Aesthetic**   | Ultra-modern 100% OLED pitch-black dark theme (`#000000`), flat `shadow-none` border-first system, accessible ShadCN dialogs, and IBM Plex typography. | Frictionless side-drawer interactions, cursor pointer interactions, and responsive mobile drawer.      |

---

## 5. Success Metrics (KPIs & OKRs)

Finly measures success across three primary operational dimensions:

### 5.1 Business & Financial KPIs

- **Monthly Recurring Revenue (MRR) Growth:** Target 15% month-over-month growth.
- **Trial-to-Paid Conversion Rate:** Target > 12% conversion from free workspace onboarding to active paid subscription.
- **Customer Churn Rate:** Maintain net monthly churn < 2.0%.

### 5.2 User Engagement & Product Activation

- **Time-to-First-Invoice (Activation):** < 2 minutes from initial workspace signup to issuing the first live invoice.
- **Daily Active Cashbook Loggers (DACL):** > 45% of active workspaces logging income/expense entries at least 3 days per week.
- **Receipt Upload Adoption:** > 30% of expense transactions attached with uploaded receipt documentation.

### 5.3 System Performance & Security Standards

- **Financial Calculation Error Rate:** **0.00%** (zero floating-point precision drift).
- **API Response Latency:** P95 latency < 120ms for data grid fetching and dashboard queries.
- **System Availability & Uptime:** 99.9% uptime with zero cross-tenant data leaks.

---

## 6. Strategic Scope & Roadmap

### Phase 1: Core Cashflow OS (Current Release v2.6.0 — Live)

- Executive analytics dashboard (Income, Expenses, Net Profit, OER, TanStack Charts, Cash Health & Runway Fortress gauge) with dynamic currency formatting.
- Jargon-free cashbook ledger with standalone tactile **Quick Entry Modal** (hardware keyboard/numpad listener `0-9`, `Numpad0-9`, `Backspace`, `C`, `E`, `I`, `Enter`, dynamic digit capacity, and focus isolation).
- **Universal Multi-Currency Engine (`useCurrency`)**: Real-time cross-tab and cross-component base currency switching across 8 global currencies (`USD`, `IDR`, `EUR`, `GBP`, `SGD`, `AUD`, `CAD`, `JPY`).
- Live Invoice builder, denormalized snapshot totals, status tracking (Paid, Unpaid, Void, Overdue), PDF print/download, and email dispatch.
- Customer & Item catalogs with side-drawer client invoice history.
- Settings page separating Profile/Workspace preferences from AI Agent API Connections.
- 100% OLED pitch-black dark mode (`#000000`), global `shadow-none` border system, and `cursor: pointer` standards.
- ShadCN accessible dialog modal architecture replacing all native browser dialogs.
- High-converting landing page with live interactive main dashboard showcase and anti-slop conversion copy.

### Phase 2: AI Multi-Model Automation (Deferred / Next Release)

- Natural language chat assistant for drafting invoices (_"Invoice Acme $1,200 for Q3 consulting"_).
- Automatic receipt OCR document data extraction into cashbook drawer.
- Automatic bank feed integration & multi-currency exchange rate conversions.

---

_Document maintained by Finly Product & Engineering Team._
