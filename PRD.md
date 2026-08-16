# Finly Web — Frontend Product Requirements Document (PRD)

## 1. Overview & Vision
Finly is a B2B cashflow operating system (OS) engineered specifically for **non-accountants** (agencies, consultants, freelancers, solopreneurs, and micro-SMEs) to manage their money professionally without needing complex accounting degrees or debit/credit double-entry bookkeeping.

This document outlines the complete product requirements, technical architecture, visual design system, and feature specifications for the **finly-web** application (`app.finly.io`).

---

## 2. Tech Stack & Engineering Architecture

### 2.1 Core Framework & Runtime
* **Framework & Bundler**: React 18 + Vite 8 + TypeScript (Strict Mode).
* **Full-stack SSR & Routing**: TanStack Start / TanStack Router with type-safe file routing.
* **Data Synchronization**: TanStack Query v5 with SSR Query Integration and optimistic updates.
* **Global State**: Zustand for layout state, sidebar expansion, and theme preferences (`light` | `dark` | `auto`).
* **Form & Table Handling**: TanStack Table (datagrids & sorting) and TanStack Form (validation).
* **Charts & Analytics**: TanStack Charts / Recharts.
* **Router Error & 404 Handling**: Custom `NotFound` component (`src/components/NotFound.tsx`) registered on `createRootRouteWithContext` and `createTanStackRouter`.

### 2.2 Styling, Design System & Aesthetics
* **Primary Brand Palette**: Pluang V2 `#463CFF` (Brand Blue/Violet).
* **Dark Mode**: 100% OLED Pitch Black (`#000000`) for all background (`--background`), card (`--card`), popover (`--popover`), and sidebar (`--sidebar`) surfaces with high-contrast `rgba(255, 255, 255, 0.12)` borders.
* **Shadow Architecture**: Flat 0px shadow (`shadow-none`) paired with crisp 1px borders for maximum visual clarity.
* **Typography**: *IBM Plex Sans* for UI body/headings and *IBM Plex Mono* (`font-mono`) for tabular currency and financial numbers.
* **Cursor Standard**: `cursor: pointer` explicitly enforced across all `<button>`, `Button` components, and `role="button"` elements.
* **Design Guidelines**: Material Design 3 (M3) cubic-bezier easing (`[0.2, 0, 0, 1]`) and Motion (Framer Motion) micro-interactions.

---

## 3. Layout & Navigation Architecture Specifications

### 3.1 Centered Topbar Header Navigation (`Topbar.tsx`)
* **Layout**: Sticky topbar header (`h-18`) with glassmorphism backdrop blur.
* **Left Section**: Finly Brand Logo (40px primary badge with "F" logo) & brand title. Mobile hamburger navigation toggle button.
* **Center Section**: Primary navigation menu pill group (`lg:flex`):
  * **Dashboard** (`/`) — `LayoutDashboard`
  * **Cashbook** (`/cashbook`) — `Wallet`
  * **Invoices** (`/invoices`) — `FileText`
  * **Customers** (`/customers`) — `Users`
  * **Catalog** (`/items`) — `Package`
  * **Settings** (`/settings`) — `Settings`
* **Right Section**: Theme switcher (`ThemeToggle`), notification bell modal, and user account profile dropdown (`Avatar`).
* **Responsive Mobile Navigation**: Mobile dropdown menu for small screens (<1024px).

### 3.2 Main Layout Container (`Layout.tsx`)
* **Full-Width Canvas**: Full-width `<main>` layout container without vertical sidebar margin offsets.
* **Max Width**: Centered `max-w-[1920px] mx-auto` container for ultra-wide desktop displays.

---

## 4. Non-Accountant Usability & Feature Specifications

### 4.1 Authentication & Onboarding (`/auth/login`)
* **Auth**: Session cookie-based authentication with CSRF token re-fetching post-login.
* **RBAC**: Support for 4 roles (`viewer`, `editor`, `admin`, `owner`).

### 4.2 Executive Dashboard (`/`)
* **5-Second Snapshot Metrics**: Total Income, Total Expenses, Net Profit, Operating Expense Ratio (OER).
* **Visualizations**: Interactive income vs expense area chart using TanStack Charts.
* **Actionable Cards**: Unpaid invoices urgency card and recent cashbook transactions.

### 4.3 Jargon-Free Cashbook (`/cashbook`)
* **Ledger Data Table**: Color-coded Income (`+ $4,000.00`) vs Expense (`- $500.00`) transaction table without debits/credits.
* **Entry Creation**: Quick-add side drawer form (3-second rule).
* **Receipts**: Signed URL rendering (`receipt_path`).

### 4.4 Invoices (`/invoices`, `/invoices/$id`, `/invoices/builder`)
* **Live Builder**: Real-time preview math: `line_total = round(unit_price × quantity_milli / 1000)`.
* **Snapshot Totals**: Immutable calculated totals written at issue time (`subtotal_in_cents`, `discount_in_cents`, `tax_amount_in_cents`, `total_in_cents`).
* **Detail View (`$id`)**: Static document card view with print, PDF download, email dispatch, mark as paid (cashbook sync), and copy link functionality.

### 4.5 Customers & Items (`/customers`, `/items`)
* **Customers Directory**: Client list, search, and side-drawer mini-history.
* **Items Catalog**: Catalog products/services with default prices and tax basis points.

### 4.6 Settings & AI Agent Connections (`/settings`)
* **Profile & Workspace Tab**: Business name, tax ID/EIN, logo upload, base currency (Scale 100 minor units), and invoice prefix settings.
* **AI Agent Connections Tab**: Multi-provider LLM API engine selector (Google Gemini, OpenAI ChatGPT, Anthropic Claude, DeepSeek AI, and Custom/Local Ollama), secret API key input with show/hide toggle, base endpoint URL, model selection dropdown, temperature preset controls (`Precise 0.1`, `Balanced 0.4`, `Creative 0.8`), and connection ping test with latency verification.

### 4.7 User Account (`/account`)
* **Account**: User profile, password security, session management, and RBAC role indicators (`owner`, `admin`, `editor`, `viewer`).

### 4.8 Landing Page (`/landing`)
* **Public Showcase**: Public landing page featuring hero showcase, feature highlights (`#features-section`), pricing table, and header/footer navigation.

---

## 5. Non-Negotiable Core Rules

1. **Minor Unit Money**: All money stored and handled as minor cents (`*_in_cents`) with a fixed scale of 100. Zero floating-point calculation drift.
2. **Tenant Isolation**: `businessId` derived strictly from server session context.
3. **No Decorative Fluff**: Border-first flat architecture (`shadow-none`) with high legibility.
