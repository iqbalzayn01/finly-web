# Finly Web — Frontend Product Requirements Document (PRD)

**Document Version:** 2.2.0  
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
* **Framework & Tooling:** React 18 · Vite 8 · TypeScript (Strict Mode).
* **Routing & SSR Engine:** TanStack Start & TanStack Router (`@tanstack/react-router`) with end-to-end type-safe file routes.
* **State Management & Data Layer:**
  * **Server State & Caching:** TanStack Query v5 (`@tanstack/react-query`) with automatic background refetching, SWR caching, and optimistic UI mutations.
  * **Client Global Store:** Zustand for layout state, UI modals, notification toasts, and active theme preferences (`light` | `dark` | `auto`).
* **Table & Form Orchestration:**
  * **TanStack Table v8:** High-performance tabular data grids, multi-column filtering, and server/client-side sorting.
  * **TanStack Form & Zod:** Type-safe form validation pipelines with real-time field error formatting.
* **Data Visualizations:** TanStack Charts & Recharts for interactive cashflow trends, area curves, and expense breakdowns.
* **Error Boundaries & 404 Routing:** Global `NotFound` handler (`src/components/NotFound.tsx`) and error boundary components registered on router initialization.

### 2.2 Styling, Tokens & Design System
* **Brand Foundation:** Pluang FinTech V2 Brand Blue/Violet (`#463CFF` / `hsl(243 100% 62%)`).
* **Dark Mode Architecture:** True 100% OLED Pitch Black (`#000000`) for canvas (`--background`), card surfaces (`--card`), popovers (`--popover`), and overlays with high-contrast subtle borders (`rgba(255, 255, 255, 0.12)`).
* **Flat Shadow System:** 0px shadow (`shadow-none`) architecture across all cards, modals, dropdowns, and tables, prioritizing crisp 1px borders and high information density over decorative gradients and heavy drop shadows.
* **Typography Hierarchy:**
  * **UI & Body:** *IBM Plex Sans* (headings, interactive labels, table headers, form inputs).
  * **Financial & Tabular Data:** *IBM Plex Mono* (`font-mono` / tabular figures) for all currency values, transaction amounts, invoice IDs, basis points, and numeric calculations.
* **Interaction & Motion:** Material Design 3 (M3) cubic-bezier easing (`[0.2, 0, 0, 1]`) and Motion (`framer-motion`) micro-transitions (modal fade-ins, drawer slides, accordion toggles).
* **Pointer Consistency:** Mandatory `cursor: pointer` on all buttons, interactive pills, tab triggers, clickable table rows, and select controls.

---

## 3. Layout, Navigation & Responsive Specifications

### 3.1 Centered Topbar Header Navigation (`Topbar.tsx`)
* **Header Structure:** Sticky, backdrop-filtered topbar navigation bar (`h-18`, `bg-card/80 backdrop-blur-md border-b border-border`).
* **Left Section:**
  * Finly Brand Logo: 40px primary brand badge with centered "F" monogram and bold "Finly" title with live version pill badge (`v2.2.0`).
  * Mobile Navigation Hamburger: Toggle drawer button visible on viewports `< 1024px`.
* **Center Section (Desktop Navigation):**
  * Centered pill button navigation group:
    * **Dashboard** (`/`) — Icon: `LayoutDashboard`
    * **Cashbook** (`/cashbook`) — Icon: `Wallet`
    * **Invoices** (`/invoices`) — Icon: `FileText`
    * **Customers** (`/customers`) — Icon: `Users`
    * **Catalog** (`/items`) — Icon: `Package`
    * **Settings** (`/settings`) — Icon: `Settings`
  * **Active Pill State:** High-contrast active styling (`bg-primary text-primary-foreground font-extrabold border border-primary/30 ring-2 ring-primary/20`) ensuring immediate spatial orientation.
* **Right Section:**
  * **Theme Switcher (`ThemeToggle.tsx`):** Light / Dark mode toggle button.
  * **Notifications Center:** Trigger for operational alerts (overdue reminders, receipt uploads).
  * **User Profile Avatar Dropdown:** User identity snapshot, active business indicator, and quick links to `/account`, workspace switching, and logout.
* **Mobile Responsive Drawer:** Collapsible slide-over drawer providing identical navigation items and active states on mobile devices (<1024px).

### 3.2 Full-Width Canvas Layout (`Layout.tsx`)
* **Sidebarless Full Canvas:** Clean, unobstructed horizontal workspace layout without vertical sidebar margins or drawer offsets.
* **Max Canvas Width:** Centered container constrained to `max-w-[1920px] mx-auto` for high-resolution desktop and ultrawide monitors.
* **Responsive Breakpoints:**
  * Mobile (`< 640px`): Single-column stacked cards, full-width inputs, and horizontal scroll tables (`min-w-[600px]`).
  * Tablet (`640px - 1024px`): 2-column metric cards, responsive split builders.
  * Desktop (`≥ 1024px`): Centered topbar pill navigation, multi-column dashboard layouts.

---

## 4. Route & Feature Specifications

### 4.1 Executive Cashflow Dashboard (`/`)
* **Purpose:** Provide an operator with an immediate 5-second health check of their business cashflow.
* **Key Performance Indicators (KPI Cards):**
  * **Total Income:** Current period cash inflows formatted with currency symbol.
  * **Total Expenses:** Current period business expenditures.
  * **Net Cashflow / Profit:** Inflows minus outflows with green/red positive/negative indicators.
  * **Operating Expense Ratio (OER):** Ratio of business expenses to income presented in percentage / basis points.
* **Visual Cashflow Chart:**
  * Interactive area chart displaying monthly cash inflow vs expense curves.
  * Tooltip showing exact minor-unit monetary figures on hover.
  * Range selector (3 Months, 6 Months, 12 Months).
* **Urgency Receivables Card:**
  * Summary of outstanding unpaid invoices and overdue alerts (`status = 'unpaid' AND due_date < today`).
  * Direct action link to invoice detail view.
* **Recent Activity Feed:** Latest 5 cashbook transactions with quick category badges and amount tags.

---

### 4.2 Jargon-Free Cashbook (`/cashbook`)
* **Purpose:** A straightforward cash ledger replacing intimidating debit/credit jargon with direct Income and Expense tracking.
* **Transaction Table:**
  * **Columns:** Date, Merchant / Client Description, Category Pill Badge, Scope (`Business` vs `Personal`), Receipt Status, Amount (`+ $4,000.00` in emerald green vs `- $500.00` in crimson red), and Row Actions.
  * **Filtering & Search:** Real-time search by merchant/client, type filter (`All`, `Income`, `Expense`), scope filter (`Business`, `Personal`), and category dropdown.
* **Quick-Add Transaction Drawer (3-Second Rule):**
  * Rapid creation form for operators on the go.
  * Fields: Type (Income / Expense segmented switch), Amount (formatted currency input), Category, Merchant / Client, Date picker, Project Tag, Notes, and File Attachment upload.
* **Receipt Viewer Modal:**
  * Secure preview of transaction receipts via temporary pre-signed URLs (`receipt_path`).

---

### 4.3 Invoice Management & Builder (`/invoices`)

#### A. Invoices List (`/invoices`)
* **Data Grid:**
  * Displays Invoice Number, Customer Name, Issue Date, Due Date, Total Amount, Derived Display Status (`Draft`, `Unpaid`, `Paid`, `Overdue`, `Void`), and Actions Menu.
* **Status Badges:**
  * **Draft:** Muted gray badge.
  * **Unpaid:** Warning amber badge.
  * **Overdue:** Urgent red badge (derived dynamically on client: `status === 'unpaid' && dueDate < today`).
  * **Paid:** Solid emerald green badge.
  * **Void:** Strikethrough dark badge.
* **Search & Filters:** Instant search by invoice number or client name, tabbed status filters.

#### B. Live Invoice Builder (`/invoices/builder`)
* **Real-Time Interactive Editor:**
  * Split-pane or responsive stacked layout with live recalculation preview.
* **Header & Customer Configuration:**
  * Customer selector (auto-fills payment terms and snapshot address).
  * Issue Date & Due Date pickers (automatically defaults due date based on customer's `paymentTermsDays`).
  * Custom notes and payment instructions.
* **Dynamic Line Items Editor:**
  * Add, reorder, and remove line items.
  * Catalog item picker (auto-fills unit price and default tax bps) or custom free-text description.
  * Quantity (scaled in thousandths, e.g. `1.500`) and Unit Price inputs.
* **Deterministic Calculation Pipeline:**
  $$\text{line\_total} = \operatorname{round}\left(\frac{\text{unit\_price} \times \text{quantity\_milli}}{1000}\right)$$
  $$\text{subtotal} = \sum \text{line\_total}$$
  $$\text{discount} = \operatorname{round}\left(\frac{\text{subtotal} \times \text{discount\_bps}}{10\,000}\right)$$
  $$\text{taxable\_base} = \text{subtotal} - \text{discount}$$
  $$\text{tax\_amount} = \operatorname{round}\left(\frac{\text{taxable\_base} \times \text{tax\_bps}}{10\,000}\right)$$
  $$\text{total} = \text{taxable\_base} + \text{tax\_amount}$$
* **Save Controls:** Save as Draft or Issue Invoice immediately.

#### C. Invoice Document Detail View (`/invoices/$id`)
* **Static Snapshot Presentation:**
  * Rendered formal invoice document card presenting snapshotted client name, line items, subtotal, discount, taxes, and total.
* **Action Toolbar:**
  * **Print / PDF Download:** Browser print triggering clean print stylesheet (`@media print`).
  * **Send Email:** Dispatches email notification with invoice snapshot.
  * **Mark as Paid:** Records payment date and atomically creates an Income entry in the Cashbook under `Invoice Payment`.
  * **Void Invoice:** Terminal cancellation path with audit reason modal.
  * **Copy Public Link:** Copies link for client review.

---

### 4.4 Customers & Catalog Directory (`/customers`, `/items`)

#### A. Customers Directory (`/customers`)
* **Client Data Grid:** Customer name, email, phone number, address, tax number/EIN, payment terms (e.g., Net 14, Net 30), and total lifetime billings.
* **Customer Drawer / Modal:** Create and update customer details without leaving the current view.
* **Inline Search:** Instant client filtering with debounced query execution.

#### B. Product & Service Catalog (`/items`)
* **Catalog Table:** Item name, description, unit (e.g., `hours`, `units`, `project`), default price in minor units, default tax rate (basis points), and active status toggle.
* **Quick Create / Edit Modal:** Simplified pricing input with currency mask.

---

### 4.5 Settings & AI Agent Integrations (`/settings`)

#### A. Workspace & Business Profile Tab
* **Business Profile:** Company legal name, business address, tax number / VAT ID / NPWP, and logo upload.
* **Invoice Formatting:** Custom invoice numbering prefix (e.g., `INV`, `FIN`), sequence preview (`INV-2026-000001`).
* **Base Currency Configuration:** Fixed Scale 100 base currency (IDR, USD, EUR, SGD, GBP, AUD, JPY).

#### B. AI Agent Connections Tab
* **Multi-Provider LLM Engine Selector:**
  * **Google Gemini** (Gemini 2.0 Flash, Gemini 1.5 Pro)
  * **OpenAI ChatGPT** (GPT-4o, GPT-4o-mini)
  * **Anthropic Claude** (Claude 3.7 Sonnet, Claude 3.5 Haiku)
  * **DeepSeek AI** (DeepSeek-V3, DeepSeek-R1)
  * **Custom / Local Ollama** (Self-hosted endpoint configuration)
* **Configuration Controls:**
  * Encrypted API Key input with secure password show/hide toggle.
  * Custom Base URL endpoint override (for enterprise proxies and local Ollama instances).
  * Model selection dropdown with capability indicators.
  * Temperature Presets: `Precise (0.1)` for strict reconciliation, `Balanced (0.4)` for standard categorization, `Creative (0.8)` for report summaries.
  * **Ping & Latency Verification:** Live connection test button validating credentials and returning real-time response latency (e.g., `⚡ Connected (142ms)`).

---

### 4.6 User Account Management (`/account`)
* **Profile Management:** User full name, email address, password change form.
* **Active Business Memberships:** List of accessible workspaces with user's specific RBAC role (`Owner`, `Admin`, `Editor`, `Viewer`).
* **Session Management:** Active session overview and secure logout button.

---

### 4.7 Public Landing Page & Pricing (`/landing`, `/pricing`)
* **Landing Page (`/landing`):**
  * Hero showcase with CTA buttons ("Start Free Trial", "Live Demo").
  * Interactive feature highlights grid (`#features-section`).
  * Non-accountant comparison breakdown (Traditional Accounting vs Finly OS).
  * Responsive footer with product sitemap and social links.
* **Pricing Page (`/pricing`):**
  * Transparent pricing tiers (Starter, Professional, Agency).
  * Monthly / Annual billing switch with discount badge.

---

## 5. Non-Negotiable Frontend Engineering Rules

1. **Integer Minor Units Everywhere:**
   * Monetary amounts are stored, calculated, and transmitted as integer minor units (`*_in_cents`) with a fixed scale of 100.
   * Rp 50.000 is represented as `5000000`; $50.00 is represented as `5000`.
   * Floating-point arithmetic and `parseFloat` are strictly prohibited in calculation paths.
   * `Money.format()` is reserved exclusively for the presentation layer.

2. **Session-Derived Multi-Tenancy:**
   * The client never invents, stores in localStorage, or manually injects `businessId` into API mutation payloads. Tenant context is managed server-side via session cookies.

3. **No Overdue Enum in State:**
   * Overdue is never a stored or mutated database enum. The frontend derives overdue status dynamically: `status === 'unpaid' && dueDate < today`.

4. **Zero-Fluff Flat Aesthetics:**
   * No excessive decorative shadows (`shadow-none`), no random rainbow gradients, no purple-on-dark clichés, and no textureless floating cards.
   * High information density, high-contrast borders (`rgba(255, 255, 255, 0.12)` in dark mode), and clear typographic hierarchy using IBM Plex fonts.

5. **Accessibility & Interactive Feedback:**
   * All interactive elements must show clear hover, focus-visible, and disabled states.
   * Asynchronous mutations must display instant loading indicators (spinners or skeleton loaders) and trigger clear toast confirmations upon success or error.

---

## 6. Frontend Verification & Quality Standards

* **TypeScript:** `npx tsc --noEmit` must pass with `0 errors` under strict mode.
* **Linting:** ESLint must pass with `0 errors`.
* **Vite Bundle Build:** `npm run build` must output optimized SSR and client bundles without circular dependency warnings.
* **Responsive Integrity:** All views must maintain layout stability across mobile (320px+), tablet (768px+), desktop (1024px+), and ultrawide displays (1920px+).
