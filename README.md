# 💎 Finly Web — Frontend Application

> **Version:** `2.4.0`  
> **Tagline:** _"Ditch the Spreadsheets. Master Your Cashflow."_  
> **Target Audience:** Non-Accountant Founders, Agency Directors, Freelancers, Consultants, and Micro-SMEs.  
> **Design Philosophy:** Function-Driven, Dribbble-grade FinTech Aesthetics, Zero Jargon, 0px Flat Shadow Architecture.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Design System & Tokens](#-design-system--tokens)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Available Scripts](#-available-scripts)
- [Routing & Navigation Architecture](#-routing--navigation-architecture)
- [Core Engineering Rules & Invariants](#-core-engineering-rules--invariants)
- [Deployment (Vercel)](#-deployment-vercel)
- [Contributing & Code Quality](#-contributing--code-quality)

---

## 🌟 Overview

**Finly Web** (`finly-web`) is the modern frontend client for **Finly** — a B2B cashflow operating system built specifically for **non-accountants**.

Traditional accounting software overwhelms non-finance professionals with debits, credits, charts of accounts, and trial balances. Spreadsheets, on the other hand, are fragile, introduce silent floating-point calculation drift, and lack real-time visibility.

Finly bridges this gap by providing an instantaneous, responsive, and aesthetically refined interface that transforms daily financial operations into intuitive, **5-second workflows**.

---

## 🚀 Key Features & Modules

| Route               | Module                                | Description & Highlights                                                                                                                                                                                                       |
| :------------------ | :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | **Public SaaS Landing Page**          | High-converting marketing landing page with SEO Schema.org JSON-LD, interactive ROI calculator, showcase tabs, bento feature grids, and trust badges.                                                                          |
| `/dashboard`        | **Executive Cashflow Dashboard**      | Executive 5-second health check featuring **Cash Health & Runway Metric Card** (safety gauge + monthly burn breakdown), interactive Cashflow Dynamics stacked bar chart (6M / YTD / 1Y), and live Multi-Currency FX Converter. |
| `/cashbook`         | **Jargon-Free Cashbook Ledger**       | Direct Income and Expense cash ledger with Business vs Personal scoping, 3-second quick-add expense drawer, and secure receipt image modal.                                                                                    |
| `/invoices`         | **Invoice Management**                | Filterable invoice data grid with dynamically derived status pills (`Draft`, `Unpaid`, `Overdue`, `Paid`, `Void`).                                                                                                             |
| `/invoices/builder` | **Live Split-Screen Invoice Builder** | Real-time interactive editor with instant mathematical recalculation preview, catalog item auto-fill, and millesimal quantity scaling.                                                                                         |
| `/invoices/$id`     | **Formal Invoice Snapshot Detail**    | Rendered formal invoice document view with print stylesheet (`@media print`), email dispatch, and atomic 1-click payment settlement.                                                                                           |
| `/customers`        | **Client Directory**                  | Customer contact management, payment terms (Net 14, Net 30), and lifetime billing aggregates.                                                                                                                                  |
| `/items`            | **Product & Service Catalog**         | Standardized reusable items with minor-unit unit prices and default tax rates.                                                                                                                                                 |
| `/settings`         | **Settings & AI Copilot Engine**      | Business workspace branding + Multi-Provider AI API connection management (Google Gemini, OpenAI ChatGPT, Anthropic Claude, DeepSeek AI, and local Ollama) with real-time ping latency checks.                                 |
| `/pricing`          | **Subscription & Pricing**            | Transparent pricing plans (Starter $0, Pro $29/mo, Enterprise $79/mo) with monthly/annual billing switch and instant Pro upgrade triggering the dynamic **`PRO`** header badge.                                                |
| `/account`          | **User Account & Workspaces**         | User profile configuration, password security, and active workspace memberships.                                                                                                                                               |

---

## 🛠️ Tech Stack & Architecture

- **Core Framework & Runtime:** [React 18](https://react.dev/) · [Vite 8](https://vitejs.dev/) · [TypeScript](https://www.typescriptlang.org/) (Strict Mode).
- **Routing & SSR:** [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router) with end-to-end type-safe file-based routing.
- **Serverless & Deployment Engine:** [Nitro](https://nitro.build/) (`nitro/vite`) generating `.output/server` and `.output/public` for zero-config Vercel SSR deployment without 404 routing errors.
- **State Management & Caching:**
  - **Server State:** [TanStack Query v5](https://tanstack.com/query) (`@tanstack/react-query`) with SWR caching, background synchronization, and optimistic UI mutations.
  - **Global & Layout UI State:** [Zustand](https://github.com/pmndrs/zustand).
  - **Subscription State:** Custom reactive subscription store (`src/lib/subscription.ts`) with cross-window event synchronization.
- **Data Tables & Forms:**
  - [TanStack Table v8](https://tanstack.com/table) for high-performance tabular data grids, sorting, and debounced search.
  - [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/) for type-safe form validation and field error formatting.
- **Data Visualizations:** [Recharts](https://recharts.org/) / TanStack Charts for responsive cashflow trends and area curves.
- **UI Components & Icons:** [Radix UI](https://www.radix-ui.com/) accessible primitives, [Lucide Icons](https://lucide.dev/), and [Motion](https://motion.dev/) (Framer Motion) micro-interactions.

---

## 🎨 Design System & Tokens

Finly follows a strict, high-density financial interface philosophy:

1. **100% OLED Pitch Black Dark Mode:**
   - Background (`--background`), cards (`--card`), popovers (`--popover`), and sidebars use pure pitch black (`#000000`).
   - Elevated surfaces are separated by crisp, high-contrast 1px borders (`rgba(255, 255, 255, 0.12)`).
2. **0px Flat Shadow Architecture:**
   - Global `shadow-none` rule (`box-shadow: none !important`) across all cards, modals, dropdowns, and tables.
3. **Typography Hierarchy:**
   - **UI & Body Copy:** _IBM Plex Sans_ for all navigation, headings, labels, and form fields.
   - **Financial Figures & Tables:** _IBM Plex Mono_ (`font-mono`) with tabular figures for all monetary amounts, basis points, and numeric calculations.
4. **Color Palette Semantics:**
   - **Brand Primary:** Modern Indigo/Violet (`#463CFF` / `hsl(243 100% 62%)`).
   - **Income / Paid / Positive:** Emerald Green (`#10B981`).
   - **Expense / Negative / Destructive:** Rose Red (`#F43F5E`).
   - **Draft / Pending:** Amber Yellow (`#F59E0B`).
5. **Pointer Consistency:**
   - Mandatory `cursor: pointer` on all buttons, interactive pills, tab triggers, clickable table rows, and select controls.

---

## 📁 Project Structure

```
finly-web/
├── .output/                # Nitro build output (Serverless bundle & public assets)
├── dist/                   # Client & SSR build distribution
├── public/                 # Static assets (favicons, logos, manifests)
├── src/
│   ├── components/
│   │   ├── layout/         # Shell components (Topbar, PublicNavbar, Sidebar)
│   │   ├── ui/             # Reusable primitives (Buttons, Dialogs, Cards, Badges)
│   │   ├── AiChatAssistant.tsx # Floating AI Copilot drawer
│   │   ├── Layout.tsx      # Dual shell router (Public marketing vs Authenticated App)
│   │   ├── NotFound.tsx    # 404 handler and navigation recovery
│   │   └── ThemeToggle.tsx # Light / Dark mode toggle switch
│   ├── hooks/              # Custom React hooks (useDebouncedSearch, useTheme, etc.)
│   ├── integrations/       # TanStack Query root provider & Devtools setup
│   ├── lib/
│   │   ├── subscription.ts # Subscription store, persistence & cross-window sync
│   │   └── utils.ts        # Tailwind cn helper, formatting & class utilities
│   ├── routes/             # TanStack Router file-based route definitions
│   │   ├── __root.tsx      # Root document shell (HTML, Head, Global Providers)
│   │   ├── index.tsx       # Route '/' -> Public SaaS Landing Page
│   │   ├── dashboard.tsx   # Route '/dashboard' -> Executive Analytics Dashboard
│   │   ├── cashbook.tsx    # Route '/cashbook' -> Cashflow Ledger
│   │   ├── invoices.tsx    # Route '/invoices' -> Invoices Data Grid
│   │   ├── invoices/
│   │   │   ├── builder.tsx # Route '/invoices/builder' -> Live Invoice Builder
│   │   │   └── $id.tsx     # Route '/invoices/:id' -> Invoice Document Detail
│   │   ├── customers.tsx   # Route '/customers' -> Customer Directory
│   │   ├── items.tsx       # Route '/items' -> Product & Service Catalog
│   │   ├── settings.tsx    # Route '/settings' -> Settings & AI Connection Manager
│   │   ├── pricing.tsx     # Route '/pricing' -> Pricing Tiers & Pro Checkout
│   │   └── account.tsx     # Route '/account' -> User Profile & Workspaces
│   ├── routeTree.gen.ts    # Auto-generated TanStack route tree (do not edit manually)
│   ├── router.tsx          # Router factory & SSR Query integration
│   └── styles.css          # Tailwind CSS v4 directives & color variables
├── package.json            # Dependencies & scripts
├── tsconfig.json           # Strict TypeScript configuration
├── tsr.config.json         # TanStack Router generator config
└── vite.config.ts          # Vite 8 + Nitro + Tailwind + TanStack plugins
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js:** `v20.x` or higher (tested on `v20` and `v24`).
- **Package Manager:** `npm` (v10+), `pnpm`, or `yarn`.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/iqbalzayn01/finly-web.git
   cd finly-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:3000`**

- **Public Landing Page:** `http://localhost:3000/`
- **Main App Dashboard:** `http://localhost:3000/dashboard`
- **Pricing & Pro Upgrades:** `http://localhost:3000/pricing`

---

## ⚡ Available Scripts

| Command                   | Description                                                                         |
| :------------------------ | :---------------------------------------------------------------------------------- |
| `npm run dev`             | Starts the Vite development server on port `3000`.                                  |
| `npm run build`           | Builds the optimized production client and server bundles with **Nitro** SSR.       |
| `npm run preview`         | Locally previews the generated production build (`.output/server`).                 |
| `npm run generate-routes` | Manually triggers TanStack Router code generator to refresh `src/routeTree.gen.ts`. |
| `npm run lint`            | Runs ESLint across all TypeScript and React source files.                           |
| `npm run format`          | Formats code with Prettier and runs ESLint with auto-fix.                           |
| `npm run check`           | Validates Prettier formatting rules without modifying files.                        |

---

## 🗺️ Routing & Navigation Architecture

### 1. File-Based Routing (`@tanstack/react-router`)

Routes in `src/routes/` automatically map to URL paths:

- `src/routes/index.tsx` $\to$ `/` (Public Landing Page)
- `src/routes/dashboard.tsx` $\to$ `/dashboard` (Executive Dashboard)
- `src/routes/cashbook.tsx` $\to$ `/cashbook`
- `src/routes/invoices.tsx` $\to$ `/invoices`
- `src/routes/invoices/builder.tsx` $\to$ `/invoices/builder`
- `src/routes/invoices/$id.tsx` $\to$ `/invoices/:id`
- `src/routes/pricing.tsx` $\to$ `/pricing`

When adding a new route, simply create a `.tsx` file inside `src/routes/` and run `npm run generate-routes` (or start the dev server).

### 2. Dual Shell Layout (`src/components/Layout.tsx`)

The application automatically determines whether to wrap a view in the public or authenticated app shell:

- **Public Pages (`/`, `/pricing`):** Renders the clean `PublicNavbar` with centered links and marketing footer.
- **App Pages (`/dashboard`, `/cashbook`, `/invoices`, etc.):** Renders the authenticated `Topbar` navigation, account avatar popover, and floating `AiChatAssistant`.

### 3. Symmetrical 3-Column Navigation Grid

Both headers (`PublicNavbar.tsx` and `Topbar.tsx`) utilize a 3-column CSS grid:

```tsx
<div className="grid grid-cols-[1fr_auto_1fr] max-w-7xl mx-auto px-6 md:px-10">
  <div className="flex justify-start">{/* Logo & Pro Pill */}</div>
  <div className="flex justify-center">{/* Center Navigation */}</div>
  <div className="flex justify-end">{/* Actions & Profile */}</div>
</div>
```

This guarantees that primary navigation pills are **always mathematically centered** on the viewport regardless of variations in logo or action button widths.

---

## 🔒 Core Engineering Rules & Invariants

When contributing to `finly-web`, always follow these non-negotiable rules:

1. **Integer Minor Units Everywhere (Scale 100):**
   - Monetary values must never use JavaScript floats or `parseFloat` in calculation logic.
   - Store and compute as integer cents (`*_in_cents`). $50.00 is `5000`; Rp 50.000 is `5000000`.
   - Use basis points for rates (`tax_bps`, `discount_bps` e.g., 1100 = 11%) and millesimals for quantities (`quantity_milli` e.g., 1500 = 1.5).
2. **Dynamic Overdue State (Never Stored):**
   - Overdue is never a hardcoded status. It must always be derived dynamically:
     ```ts
     const isOverdue = status === 'unpaid' && new Date(dueDate) < new Date()
     ```
3. **Immutable Snapshot Totals:**
   - Subtotals, tax amounts, and grand totals are snapshotted on issue. Do not dynamically recompute totals from live catalog items on read.
4. **Multi-Tenancy Isolation:**
   - The frontend never invents or manually injects `businessId` into API payloads. Tenant context is handled server-side via session cookies.

---

## ☁️ Deployment (Vercel)

`finly-web` is configured for **zero-config Vercel SSR deployment** using **Nitro**:

1. **Nitro Engine (`nitro/vite`):**
   - Configured in `vite.config.ts`.
   - Automatically detects Vercel (`process.env.VERCEL`) and packages the serverless runtime into `.output/server` and static assets into `.output/public`.
   - Prevents `404: NOT_FOUND` errors on direct URL loads or page refreshes on subroutes (`/dashboard`, `/pricing`, `/invoices`, etc.).

2. **Deploying on Vercel:**
   - Connect your GitHub repository on [Vercel Dashboard](https://vercel.com/new).
   - **Framework Preset:** Vercel automatically detects _TanStack Start / Nitro_.
   - **Build Command:** `npm run build`
   - **Output Directory:** Automatic (managed by Nitro).

---

## 🤝 Contributing & Code Quality

Before opening a Pull Request:

1. Ensure TypeScript compiles with zero errors:
   ```bash
   npx tsc --noEmit
   ```
2. Verify production build succeeds:
   ```bash
   npm run build
   ```
3. Run linting and formatting:
   ```bash
   npm run check
   ```

---

## 📄 License

Proprietary — Finly Inc. All rights reserved.
