# Finly — Executive Product Brief

**Product Name:** Finly (B2B Cashflow Operating System)  
**Tagline:** *"Ditch the Spreadsheets. Master Your Cashflow."*  
**Document Type:** Core Product Brief — The Why & Who  
**Version:** 2.1.0  
**Target Market:** B2B Agencies, Consultants, Freelancers, Solopreneurs, and Micro-SMEs  

---

## 1. Executive Summary & Product Vision

Small businesses and freelancers overwhelmingly rely on manual spreadsheets to manage their cashflow, invoices, and expenses. Spreadsheets are slow, easily broken by incorrect formulas, introduce dangerous floating-point calculation errors, and fail to provide real-time executive visibility into true financial health.

**Finly** is built to replace spreadsheets with a blazingly fast, 100% trustworthy B2B cashflow operating system. It combines an accurate minor-unit ledger, real-time invoice builder with instant preview math, customer/catalog directories, executive analytics, and multi-provider AI Agent integration (Google Gemini, OpenAI ChatGPT, Anthropic Claude, DeepSeek AI, and self-hosted Ollama).

Our core philosophy: **Accuracy is non-negotiable.** Every financial calculation is backed by integer minor-unit arithmetic, strict tenant isolation, and human-in-the-loop AI safety boundaries.

---

## 2. Core Focus: The Why (The Problem)

### 2.1 Fragility & Danger of Spreadsheets
- **Formula Breaks & Human Error:** A single broken cell formula or deleted row in Excel/Google Sheets corrupts entire cashflow forecasts without warning.
- **Floating-Point Financial Errors:** Standard spreadsheet/JS floating-point arithmetic (`0.1 + 0.2 = 0.30000000000000004`) causes pennies to drift in client balances, ruining financial trust.
- **No Real-Time Invoicing Sync:** Creating invoices in a separate Word or PDF tool requires manual double-entry into the cashbook spreadsheet, leading to forgotten receivables and delayed payments.

### 2.2 Lack of Executive Visibility
- Small business owners lack an instant 5-second snapshot of their financial health.
- They struggle to answer critical operational questions: *"What is my true Operating Expense Ratio (OER) this month?", "Which client invoices are overdue?", "How much liquid cash do I actually have?"*

### 2.3 The AI Trust & Execution Gap
- Business owners want AI assistance for drafting invoices and logging transactions, but dread un-audited AI modifications to their financial records.
- Existing software lacks flexibility, locking businesses into single proprietary AI models without supporting local or enterprise LLM connections.

---

## 3. Core Focus: The Who (Target Market & Buyer Personas)

### 3.1 Primary Target Market
Finly is engineered specifically for **service-based B2B micro-businesses**:
- **Agencies & Consultancies:** 2–20 person digital marketing, design, software, and management agencies issuing recurring project invoices.
- **Freelancers & Independent Consultants:** High-value contractors needing fast 3-second cashbook entry and professional client billing.
- **Micro-SMEs & Solopreneurs:** Small business founders requiring strict cashflow tracking without hiring full-time accounting staff.

### 3.2 Ideal Customer Personas

#### Persona 1: Sarah — Creative Agency Director
- **Profile:** Runs a 8-person design agency managing $50k/month in revenue across 15 active clients.
- **Pain Points:** Spends hours assembling monthly invoices, chasing late client payments, and reconciling spreadsheet cashflow.
- **Goals:** Wants automated invoice status tracking, instant PDF generation, clear OER metrics, and a clean professional brand experience for her clients.

#### Persona 2: Alex — Freelance Full-Stack Consultant
- **Profile:** Independent software engineer working with 3 retainer clients.
- **Pain Points:** Forgets to log business expenses, struggles with messy receipt files, and wants a fast mobile-friendly transaction logger.
- **Goals:** Needs a 3-second quick-add expense drawer, receipt upload capability, and multi-model AI API key integration for custom workflows.

---

## 4. Value Proposition & Key Differentiators

| Core Pillar | Value Delivered | Unfair Advantage |
| :--- | :--- | :--- |
| **100% Trustworthy Ledger** | Zero floating-point drift. All financial calculations use minor integer minor-units at a fixed scale of 100. | Strict backend invariants with tenant-scoped isolation (`set_config('app.business_id', ...)`). |
| **Instant Invoice Engine** | Real-time invoice builder math with instant side-by-side document preview. | Snapshot line-item & total calculations written at issue time (`subtotal_in_cents`, `total_in_cents`). |
| **Multi-Provider AI Connection** | Freedom to connect any LLM (Gemini, OpenAI, Claude, DeepSeek, Ollama/vLLM) via API key. | Human-in-the-loop architecture: AI drafts records; humans explicitly approve before database entry. |
| **State-of-the-Art Aesthetic** | Ultra-modern 100% OLED pitch-black dark theme (`#000000`), flat `shadow-none` border-first system, and IBM Plex typography. | Frictionless side-drawer interactions and responsive mobile navigation drawer. |

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

### Phase 1: Core Cashflow OS (Current Release v2.1.0 — Live)
- Executive analytics dashboard (Income, Expenses, Net Profit, OER, TanStack Charts).
- Cashbook ledger with multi-criteria filtering, side-drawer quick-add, and signed receipt previews.
- Live Invoice builder, denormalized snapshot totals, status tracking (Paid, Unpaid, Void, Overdue), PDF print/download, and email dispatch.
- Customer & Item catalogs with side-drawer client invoice history.
- Settings page separating Profile/Workspace preferences from AI Agent API Connections.
- 100% OLED pitch-black dark mode (`#000000`) and global `shadow-none` border system.

### Phase 2: AI Multi-Model Automation (Deferred / Next Release)
- Natural language chat assistant for drafting invoices (*"Invoice Acme $1,200 for Q3 consulting"*).
- Automatic receipt OCR document data extraction into cashbook drawer.
- Bank feed integration & multi-currency exchange rate conversions.

---

*Document maintained by Finly Product & Engineering Team.*
