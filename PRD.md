# Finly Web — Frontend Product Requirements Document (PRD)

**Document Version:** 2.4.0  
**Scope:** Frontend Application Only (`finly-web` / `app.finly.io`)  
**Target Audience:** Non-accountant operators (freelancers, consultants, agencies, solopreneurs, and micro-SME founders)  
**Design Philosophy:** Function-Driven, Dribbble-grade FinTech Aesthetics, Zero Jargon, 0px Flat Architecture

---

## 1. Executive Summary & Product Vision

**Finly** is a modern B2B cashflow operating system engineered specifically to empower **non-accountants** to manage business finances with absolute professional precision without the steep learning curve of traditional double-entry bookkeeping (no debits, credits, or chart-of-account reconciliations).

The web client (`finly-web`) provides an instantaneous, responsive, and visually refined user experience that transforms daily financial operations into intuitive, 5-second workflows.

---

## 2. Technical Stack & Architecture

### 2.1 Core Framework & Runtime

- **Framework & Tooling:** React 19 · Vite · TypeScript (Strict Mode).
- **Routing & SSR Engine:** TanStack Start & TanStack Router (`@tanstack/react-router`) with end-to-end type-safe file routes.
- **State Management & Data Layer:**
  - **Server State & Caching:** TanStack Query v5 (`@tanstack/react-query`) with automatic background refetching, SWR caching, and optimistic UI mutations.
  - **Client Global Store:** Zustand for layout state, UI modals, and notification toasts.
  - **Subscription Store (`src/lib/subscription.ts`):** Reactive subscription hook and persistence with cross-window event synchronization (`starter`, `pro`, `enterprise`).
- **Table & Form Orchestration:**
  - **TanStack Table v8:** High-performance tabular data grids, multi-column filtering, and server/client-side sorting.
  - **TanStack Form & Zod:** Type-safe form validation pipelines with real-time field error formatting.
- **Modal & Dialog Architecture:**
  - **Radix UI Dialog & ShadCN UI Primitives (`src/components/ui/dialog.tsx`, `modal.tsx`, `alert-modal.tsx`, `api-key-modal.tsx`, `logout-modal.tsx`):** 100% accessible, keyboard-trapped, focus-managed dialog overlays with smooth Motion transitions. Zero native browser `window.alert()` or `window.confirm()` calls.
- **Data Visualizations:** TanStack Charts & Recharts for interactive cashflow trends, area curves, and expense breakdowns.
- **Error Boundaries & 404 Routing:** Global `NotFound` handler (`src/components/NotFound.tsx`) and error boundary components registered on router initialization.

### 2.2 Styling, Tokens & Design System

- **Brand Foundation:** Pluang FinTech V2 Brand Blue/Violet (`#463CFF` / `hsl(243 100% 62%)`).
- **Dark Mode Architecture:** True 100% OLED Pitch Black (`#000000`) for canvas (`--background`), card surfaces (`--card`), popovers (`--popover`), and overlays with high-contrast subtle borders (`rgba(255, 255, 255, 0.12)`).
- **Flat Shadow System:** 0px shadow (`shadow-none`) architecture across all cards, modals, dropdowns, and tables, prioritizing crisp 1px borders and high information density over decorative gradients and heavy drop shadows.
- **Typography Hierarchy:**
  - **UI & Body:** _IBM Plex Sans_ (headings, interactive labels, table headers, form inputs).
  - **Financial & Tabular Data:** _IBM Plex Mono_ (`font-mono` / tabular figures) for all currency values, transaction amounts, invoice IDs, basis points, and numeric calculations.
- **Interaction & Motion:** Material Design 3 (M3) cubic-bezier easing (`[0.2, 0, 0, 1]`) and Motion (`framer-motion`) micro-transitions.
- **Pointer Consistency:** Mandatory `cursor: pointer` on all buttons, interactive pills, tab triggers, clickable table rows, and select controls.

---

## 3. Layout, Navigation & Responsive Specifications

### 3.1 3-Column Centered Topbar Header (`Topbar.tsx`)

- **Header Structure:** Sticky, backdrop-filtered topbar navigation bar (`h-18`, `bg-card/80 backdrop-blur-md border-b border-border`).
- **3-Column Balanced Grid (`grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr]`):**
  - **Left Column (Logo & Pro Badge):**
    - Finly Brand Logo: 40px primary brand badge with centered "F" monogram and bold "Finly" title with live version indicator.
    - **Dynamic Pro Badge / Upgrade Button:** Placed directly adjacent to the logo. Displays `"Upgrade to Pro"` button for Starter users, which automatically transitions to a gradient **`PRO`** badge upon upgrading.
    - Mobile Navigation Toggle: Hamburger button visible on viewports `< 1024px`.
  - **Center Column (Geometrically Centered Navigation):**
    - Centered pill button navigation group:
      - **Dashboard** (`/dashboard`) — Icon: `LayoutDashboard`
      - **Cashbook** (`/cashbook`) — Icon: `Wallet`
      - **Invoices** (`/invoices`) — Icon: `FileText`
      - **Customers** (`/customers`) — Icon: `Users`
      - **Catalog** (`/items`) — Icon: `Package`
      - **Settings** (`/settings`) — Icon: `Settings`
    - **Active Pill State:** High-contrast active styling (`bg-primary text-primary-foreground font-extrabold border border-primary/30 ring-2 ring-primary/20`).
  - **Right Column (Actions):**
    - **Theme Switcher (`ThemeToggle.tsx`):** Light / Dark mode toggle.
    - **Notifications Center:** Operational alerts popover.
    - **User Profile Avatar Dropdown:** User identity, active Pro subscription indicator, links to `/account`, `/settings`, and smooth ShadCN logout dialog.
- **Mobile Responsive Drawer:** Collapsible slide-over drawer providing identical navigation items and active states on mobile devices (<1024px).

### 3.2 Public Header (`PublicNavbar.tsx`)

- **Structure:** 3-column CSS grid (`grid grid-cols-[1fr_auto_1fr] max-w-7xl mx-auto px-6 md:px-10`).
- **Left:** Brand logo linked to root (`/`).
- **Center:** Perfectly centered navigation links (`Overview` `/`, `Features` `/#features-section`, `Pricing` `/pricing`).
- **Right:** Theme toggle and "Open Dashboard" button linking to `/dashboard`.

### 3.3 Canvas Layout (`Layout.tsx`)

- **Public Pages:** `/` (Landing Page) and `/pricing` with public navbar and marketing footer.
- **Authenticated App Pages:** `/dashboard`, `/cashbook`, `/invoices`, `/customers`, `/items`, `/settings`, `/account` with topbar and AI assistant.
- **Max Canvas Width:** Centered container constrained to `max-w-[1920px] mx-auto` for widescreen desktops.

---

## 4. Route & Feature Specifications

### 4.1 Public SaaS Landing Page (`/`)

- **Hero Section:**
  - Eyebrow: _"ZERO-JARGON CASHFLOW OPERATING SYSTEM"_
  - High-converting headline: _"Stop guessing your agency runway. Take control of your cashflow."_
  - Subheadline: _"Eliminate floating-point ledger errors, turn vendor receipts into clean invoices in seconds, and track real-time multi-currency cashflow."_
  - Dual high-intent CTAs: `"Start Free Trial"` (linking to `/pricing`) and `"Explore Live Demo"` (linking to `/dashboard`).
- **Interactive Live Dashboard Window:**
  - Exact embedded main dashboard inside the browser mockup window.
  - Live period selector, 4 M3 tonal metric cards (Total Net Balance, Total Income, Total Expenses, Cash Health & Runway Fortress gauge).
  - Interactive Cashflow Dynamics dual bar chart with `6M`, `YTD`, and `1Y` timeframe filtering.
  - 3-column financial analytics grid: Operating Margin statistics, interactive FX Currency Converter (USD $\to$ IDR/EUR/GBP/SGD), and live filtered Recent Activity cashbook feed.
- **Interactive ROI Calculator:** Real-time slider calculating monthly time saved (hours) and cashflow recovered ($).
- **Bento Grid Features:** Zero Floating-Point Drift, Human-in-the-Loop AI Invoicing, Live Multi-Currency Settlement, and PostgreSQL Row-Level Security.
- **Social Proof & Testimonials:** Trust proof from 500+ client-service agencies and authentic operator quotes.
- **SEO Structured Data:** Integrated Schema.org `SoftwareApplication` JSON-LD metadata.

---

### 4.2 Executive Cashflow Dashboard (`/dashboard`)

- **Purpose:** Provide an operator with an immediate 5-second health check of their business cashflow.
- **Key Performance Indicators (Top 4 KPI Cards):**
  1. **Total Net Balance:** $148,250.00 (+12.5% trend, progress against target).
  2. **Total Income:** $34,120.00 (+8.2% trend, emerald tonal styling).
  3. **Total Expenses:** $12,450.00 (-2.4% trend, rose tonal styling).
  4. **Cash Health & Runway Card:**
     - **Header:** `ShieldCheck` icon in emerald tonal badge + `Healthy (94/100)` status badge with live pulse indicator.
     - **Main Metric:** `14.2 Months` (`font-mono text-2xl lg:text-3xl font-bold`) + `↗ +1.5 mo vs last mo` micro delta.
     - **Visual Safety Gauge:** Horizontal emerald-to-indigo gradient progress bar showing Fortress Zone status (>6 Mo Runway).
     - **Footer Micro-Grid:** 2-column breakdown of `Avg Monthly Burn: $12,450.00` and `Liquid Cash: $148,250.00`.
- **Cashflow Dynamics Chart:**
  - Dual stacked bar chart comparing monthly Inflows vs Expenses.
  - Timeframe filter pills (`6M`, `YTD`, `1Y`).
  - Custom interactive tooltips with net cashflow calculation.
- **Bottom Grid (3 Cards):**
  1. **Financial Statistics:** Operating Profit Margin (63.4%), Avg. Invoice Settled ($4,250.00), On-Time Payment Rate (96.5%).
  2. **FX Currency Converter:** Interactive live currency conversion (USD, IDR, EUR, GBP, SGD) with minor-unit calculation.
  3. **Recent Activity Feed:** Latest cash transactions with instant type filtering (`All`, `Income`, `Expense`).

---

### 4.3 Jargon-Free Cashbook (`/cashbook`)

- **Transaction Table:** Date, Merchant / Client Description, Category Pill Badge, Scope (`Business` vs `Personal`), Receipt Status, Amount (`+` in emerald green vs `-` in crimson red), and Row Actions.
- **Filtering & Search:** Real-time search, type filters, scope filters, and category dropdowns.
- **Quick-Add Transaction Drawer (3-Second Rule):** Rapid creation form for operators on the go.
- **Receipt Viewer Modal & Delete Confirmations:** Accessible ShadCN Dialog modals for secure receipt previews and destructive action confirmations.

---

### 4.4 Invoice Management & Builder (`/invoices`)

#### A. Invoices List (`/invoices`)

- Displays Invoice Number, Customer Name, Issue Date, Due Date, Total Amount, Derived Display Status (`Draft`, `Unpaid`, `Paid`, `Overdue`, `Void`), and Actions Menu with animated ShadCN delete/void dialogs.
- Overdue status derived dynamically: `status === 'unpaid' && dueDate < today`.

#### B. Live Invoice Builder (`/invoices/builder`)

- Split-pane interactive editor with real-time recalculation preview.
- Line items editor with catalog picker, millesimal quantities (`quantity_milli`), and integer basis points tax/discount.
- Mathematical order: Line totals $\to$ Subtotal $\to$ Discount $\to$ Taxable Base $\to$ Tax $\to$ Grand Total.

#### C. Invoice Document Detail View (`/invoices/$id`)

- Rendered formal invoice document presenting snapshotted data.
- Actions: Print/PDF download (`@media print`), email dispatch, atomic "Mark as Paid" cashbook sync, and void cancellation with ShadCN alert confirmations.

---

### 4.5 Customers & Catalog Directory (`/customers`, `/items`)

- **Customers Directory (`/customers`):** Client contact directory, payment terms (Net 14, Net 30), lifetime billings, and create/edit modal.
- **Product & Service Catalog (`/items`):** Reusable products and services with default minor-unit pricing and default tax rates.
- **Destructive Action Safety:** All delete actions protected by custom accessible ShadCN Alert Modals.

---

### 4.6 Settings & AI Agent Integrations (`/settings`)

- **Workspace Profile:** Business legal name, business address, tax number/VAT/NPWP, and logo upload.
- **AI Agent Connections:** Multi-provider API connection management via custom ShadCN API Key Dialogs:
  - Google Gemini (Gemini 2.0 Flash, Gemini 1.5 Pro)
  - OpenAI ChatGPT (GPT-4o, GPT-4o-mini)
  - Anthropic Claude (Claude 3.7 Sonnet, Claude 3.5 Haiku)
  - DeepSeek AI (DeepSeek-V3, DeepSeek-R1)
  - Local / Self-Hosted Ollama (Custom Base URL)
- Real-time ping latency verification (`⚡ Connected (142ms)`).

---

### 4.7 User Account Management (`/account`)

- Profile details, password security, active workspace memberships, static card surfaces without hover displacement, and session management.

---

### 4.8 Subscription & Pricing (`/pricing`)

- Transparent pricing plans (Starter $0, Pro $29/mo or $23/mo annual, Enterprise $79/mo).
- 1-click Pro upgrade with real-time app-wide subscription state synchronization.
- Monthly / Annual billing switch with 20% discount savings pill.

---

## 5. Non-Negotiable Frontend Engineering Rules

1. **Integer Minor Units Everywhere:**
   - Monetary amounts are stored, calculated, and transmitted as integer minor units (`*_in_cents`) with a fixed scale of 100.
   - Floating-point arithmetic and `parseFloat` are strictly prohibited in calculation paths.
   - `Money.format()` is reserved exclusively for presentation.

2. **Session-Derived Multi-Tenancy:**
   - Client never manually injects `businessId`. Tenant context is managed server-side via session cookies.

3. **No Overdue Enum in State:**
   - Overdue is derived dynamically on client: `status === 'unpaid' && dueDate < today`.

4. **Zero-Fluff Flat Aesthetics:**
   - Global `shadow-none` rule, high information density, crisp 1px borders, and IBM Plex typography.

5. **Accessibility & Interactive Consistency:**
   - Mandatory `cursor: pointer` on interactive elements, consistent M3 transitions, responsive grid centering, and ShadCN Dialog focus-trapping.

---

## 6. Frontend Verification & Quality Standards

- **TypeScript:** Strict compilation with `0 errors`.
- **Vite Bundle Build:** Production build passed with `0 errors`.
- **Responsive Integrity:** Layout stability across mobile (320px+), tablet (768px+), desktop (1024px+), and ultrawide (1920px+).
