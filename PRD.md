# Finly Web — Frontend Product Requirements Document (PRD)

## 1. Overview & Vision
Finly is a B2B cashflow operating system (OS) designed for agencies, consultants, freelancers, solopreneurs, and micro-SMEs.
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

## 3. Layout & Structure Specifications

### 3.1 Sidebar Navigation (`Sidebar.tsx`)
* **Width States**: Expanded (240px) vs Collapsed (80px) with synchronized M3 transitions.
* **Search Input**: Sized to `h-11 rounded-2xl` matching navigation item pills.
* **Floating Toggle Button**: Floating right-margin button positioned at `absolute -right-3.5 top-[22px] z-50`.
* **Collapsed Logo Header**: Centered 44px brand logo button with expand indicator.
* **Mobile Drawer**: Responsive mobile slide-in drawer with dark backdrop blur overlay.

### 3.2 Topbar Header (`Topbar.tsx`)
* **Layout**: Sticky header (`h-18`), page title/subtitle matching active route.
* **Controls**: Mobile hamburger drawer toggle, theme switcher (`Light`, `Dark`, `Auto`), notification bell modal, and user account dropdown.

### 3.3 Main Layout Container (`Layout.tsx`)
* **Max Width**: Centered `max-w-[1920px] mx-auto` container for widescreen displays.

---

## 4. Feature Modules & Route Specifications

### 4.1 Authentication & Onboarding (`/auth/login`)
* **Auth**: Session cookie-based authentication with CSRF token re-fetching post-login.
* **RBAC**: Support for 4 roles (`viewer`, `editor`, `admin`, `owner`).

### 4.2 Executive Dashboard (`/`)
* **Metrics Cards**: Total Income, Total Expenses, Net Profit, Operating Expense Ratio (OER).
* **Visualizations**: Interactive income vs expense area chart using TanStack Charts.
* **Recent Activity**: Recent cashbook transactions and unpaid invoices card.

### 4.3 Cashbook (`/cashbook`)
* **Ledger Data Table**: Transaction table with multi-criteria filtering (date, type, scope).
* **Entry Creation**: Quick-add side drawer form.
* **Receipts**: Signed URL rendering (`receipt_path`).

### 4.4 Invoices (`/invoices`, `/invoices/$id`, `/invoices/builder`)
* **Live Builder**: Real-time preview math: `line_total = round(unit_price × quantity_milli / 1000)`.
* **Snapshot Totals**: Immutable calculated totals written at issue time (`subtotal_in_cents`, `discount_in_cents`, `tax_amount_in_cents`, `total_in_cents`).
* **Detail View (`$id`)**: Static document card view with print, PDF download, email dispatch, mark as paid, and copy link functionality.

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

1. **Minor Unit Money**: All money stored and handled as minor cents (`*_in_cents`) with a fixed scale of 100.
2. **Tenant Isolation**: `businessId` derived strictly from server session context.
3. **No Decorative Fluff**: Border-first flat architecture (`shadow-none`) with high legibility.
