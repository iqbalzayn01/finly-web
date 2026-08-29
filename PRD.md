# Finly Web — Frontend Product Requirements Document (PRD)

**Document Version:** 2.7.0  
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
  - **Universal Multi-Currency Engine (`src/lib/currency.ts`):** Reactive tenant base currency state with cross-tab and cross-component broadcasting (`USD`, `IDR`, `EUR`, `GBP`, `SGD`, `AUD`, `CAD`, `JPY`), scale-100 minor unit formatting, and high-denomination formatting.
- **Table & Form Orchestration:**
  - **TanStack Table v8:** High-performance tabular data grids, multi-column filtering, and server/client-side sorting.
  - **TanStack Form & Zod:** Type-safe form validation pipelines with real-time field error formatting.
- **Modal & Dialog Architecture:**
  - **Radix UI Dialog & ShadCN UI Primitives (`src/components/ui/dialog.tsx`, `modal.tsx`, `alert-modal.tsx`, `api-key-modal.tsx`, `logout-modal.tsx`, `quick-entry-modal.tsx`):** 100% accessible, keyboard-trapped, focus-managed dialog overlays with smooth Motion transitions. Zero native browser `window.alert()` or `window.confirm()` calls.
- **Data Visualizations:** TanStack Charts & Recharts with Monotone Bezier Curves (`type="monotone"`) and vertical gradient fills for interactive cashflow trends and area curves.
- **Error Boundaries & 404 Routing:** Global `NotFound` handler (`src/components/NotFound.tsx`) and error boundary components registered on router initialization.

### 2.2 Styling, Tokens & Design System

- **Brand Foundation:** Modern Indigo/Violet (`#463CFF` / `hsl(243 100% 62%)`).
- **Dark Mode Architecture:** True 100% OLED Pitch Black (`#101010` / `#000000`) for canvas (`--background`), card surfaces (`--card`), popovers (`--popover`), and overlays with high-contrast subtle borders (`rgba(255, 255, 255, 0.12)`).
- **Flat Shadow System:** 0px shadow (`shadow-none`) architecture across all cards, modals, dropdowns, and tables, prioritizing crisp 1px borders and high information density over decorative gradients and heavy drop shadows.
- **Typography Hierarchy:**
  - **UI & Body:** _IBM Plex Sans_ (headings, interactive labels, table headers, form inputs).
  - **Financial & Tabular Data:** _IBM Plex Mono_ (`font-mono` / tabular figures) for all currency values, transaction amounts, invoice IDs, basis points, and numeric calculations.
- **Interaction & Motion:** Material Design 3 (M3) cubic-bezier easing (`[0.2, 0, 0, 1]`) and Motion (`framer-motion`) micro-transitions.
- **Pointer Consistency & Viewport Stability:** Mandatory `cursor: pointer` on all buttons, interactive pills, tab triggers, clickable table rows, and select controls. `scrollbar-gutter: stable` and popper dropdown anchoring to eliminate layout shifts.

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

### 3.2 Canvas Layout (`Layout.tsx`)

- **Dedicated App Layout:** Exclusively renders the high-performance application Topbar layout with centered container constrained to `max-w-[1920px] mx-auto` and floating AI Copilot.

---

## 4. Route & Feature Specifications

### 4.1 Direct App Entry (`/`)

- **Purpose:** Automatically redirects root traffic directly to `/dashboard` for instant, friction-free access to the cashflow operating system.

---

## 4.2 Financial Overview Dashboard (`/dashboard`)

- **Purpose:** Provide an operator with an immediate 5-second health check of their business cashflow organized in a balanced 4-row architecture:
- **Row 1: Top Metric Cards (3 Columns):**
  1. **Total Balance:** Dynamic formatting (+12.5% trend, progress against target, available cash across accounts).
  2. **Total Income:** Dynamic formatting (+8.2% trend vs last month, emerald styling, paid invoices & client payments).
  3. **Total Expenses:** Dynamic formatting (-2.4% trend vs last month, rose styling, bills, tools, and operational spending).
- **Row 2: Asymmetric Cashflow & Health (65% : 35% / Col-Span 8 : Col-Span 4):**
  - **Left (`lg:col-span-8`): Cash Flow Smooth Monotone Area Spline Chart:**
    - Dual Smooth Gradient Area curve (`type="monotone"`) comparing monthly Income vs Expenses.
    - Timeframe filter pills (`6M`, `YTD`, `1Y`).
    - Summary footer: Net profit and trailing average monthly spending.
  - **Right (`lg:col-span-4`): Cash Runway & Health Card:**
    - Header with `ShieldCheck` and `Healthy (94/100)` badge.
    - Big metric: `14.2 Months` (+1.5 mo vs last month).
    - Visual safety target meter: `Strong (6+ Months)` buffer gauge with gradient progress fill.
    - Footer breakdown: Monthly Spending and Available Cash.
- **Row 3: Recent Transactions (Full Width / Col-Span 12):**
  - Verified ledger entries, invoice settlements, and operating expenses.
  - Type filter pills: `All`, `Income`, `Expenses`.
  - Transaction rows with merchant name, category, relative timestamp, and status badges (`Paid`, `Receipt`, `No Receipt`).
  - Direct link to `/cashbook`.
- **Row 4: Key Performance & Currency Converter (2 Columns / 50% : 50%):**
  - **Left: Business Health Statistics:** Profit Margin (63.4%), Average Invoice, and On-Time Payments (96.5%).
  - **Right: Live Currency Converter:** Interactive base amount input with auto-updating conversion rates.

---

### 4.3 Jargon-Free Cashbook (`/cashbook`)

- **Full-Width Transaction Table:** Date, Merchant / Client Description, Category Pill Badge, Scope (`Business` vs `Personal`), Receipt Status, Dynamic Minor-Unit Amount (`+` in emerald green vs `-` in crimson red), and Row Actions.
- **Filtering & Search:** Real-time search, type filters, scope filters, and category dropdowns.
- **Standalone Quick Entry Modal:** Tactile 3×4 numpad modal with spring physics animation, dynamic base currency formatting, and hardware keyboard / numeric keypad event listeners (`0-9`, `Numpad0-9`, `Backspace`, `C`, `E`, `I`, `Enter`) with smart focus isolation when typing in text fields.
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

- **Workspace Profile:** Business legal name, business address, tax number/VAT/NPWP, base currency selection (USD, IDR, EUR, GBP, SGD, AUD, CAD, JPY), and logo upload.
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
   - Database enum contains strictly `draft | unpaid | paid | void`.
   - `Overdue` is derived entirely on the client: `status === 'unpaid' && dueDate < today`.

4. **Snapshot Immutability:**
   - Historical invoices render immutable snapshots (`customer_name_snapshot`, `subtotal_in_cents`, `tax_amount_in_cents`, `total_in_cents`).

5. **No Native Browser Alerts:**
   - All confirmations and alerts utilize custom accessible ShadCN Radix Dialog components.
