# 💎 Finly Web — Frontend Application

> **Version:** `2.7.0`  
> **Tagline:** _"Ditch the Spreadsheets. Master Your Cashflow."_  
> **Target Audience:** Non-Accountant Founders, Agency Directors, Freelancers, Consultants, and Micro-SMEs.  
> **Design Philosophy:** Function-Driven, Dribbble-grade FinTech Aesthetics, Zero Jargon, 0px Flat Shadow Architecture.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features & Modules](#-key-features--modules)
- [Universal Currency & Ledger Architecture](#-universal-currency--ledger-architecture)
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

| Route               | Module                                | Description & Highlights                                                                                                                                                                                                                                                                                                                                               |
| :------------------ | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | **Direct App Entry**                  | Instant router redirect straight into the authenticated **Financial Overview** dashboard for immediate operational access.                                                                                                                                                                                                                                             |
| `/dashboard`        | **Financial Overview (4-Row Grid)**   | Executive dashboard featuring **Row 1 Top Metrics** (Total Balance, Total Income, Total Expenses), **Row 2 Asymmetric Cashflow & Health** (Smooth Monotone Area Spline Chart + Runway Safety Index), **Row 3 Full-Width Recent Transactions** table, and **Row 4 Performance & Live Currency Converter**. Dynamic currency formatting across all cards and chart axes. |
| `/cashbook`         | **Jargon-Free Cashbook Ledger**       | Direct Income and Expense cash ledger with Business vs Personal scoping, standalone **Quick Entry Modal** with hardware numeric keypad (`0-9`, `Numpad0-9`, `Backspace`, `C`, `E`, `I`, `Enter`), tactile button feedback, and secure receipt attachment verification.                                                                                                 |
| `/invoices`         | **Invoice Management**                | Filterable invoice data grid with dynamically derived status pills (`Draft`, `Unpaid`, `Overdue`, `Paid`, `Void`) and dynamic summary metric totals.                                                                                                                                                                                                                   |
| `/invoices/builder` | **Live Split-Screen Invoice Builder** | Real-time interactive editor with instant mathematical recalculation preview, catalog item auto-fill, dynamic minor-unit pricing, and millesimal quantity scaling.                                                                                                                                                                                                     |
| `/invoices/$id`     | **Formal Invoice Snapshot Detail**    | Rendered formal invoice document view with print stylesheet (`@media print`), email dispatch, and atomic 1-click payment settlement in active workspace currency.                                                                                                                                                                                                      |
| `/customers`        | **Client Directory**                  | Customer contact management, payment terms (Net 14, Net 30), and lifetime billing aggregates.                                                                                                                                                                                                                                                                          |
| `/items`            | **Product & Service Catalog**         | Standardized reusable items with minor-unit unit prices and default tax rates formatted with active base currency.                                                                                                                                                                                                                                                     |
| `/settings`         | **Settings & AI Copilot Engine**      | Business workspace branding, Base Currency regional selection (USD, IDR, EUR, GBP, SGD, AUD, CAD, JPY) with instant live reactivity across tabs + Multi-Provider AI API connection management (Gemini, OpenAI, Claude, DeepSeek, Ollama).                                                                                                                              |
| `/pricing`          | **Subscription & Pricing**            | Transparent pricing plans (Starter $0, Pro $29/mo, Enterprise $79/mo) with monthly/annual billing switch and instant Pro upgrade triggering the dynamic **`PRO`** header badge.                                                                                                                                                                                        |
| `/account`          | **User Account & Workspaces**         | User profile configuration, password security, and active workspace memberships.                                                                                                                                                                                                                                                                                       |

---

## 🪙 Universal Currency & Ledger Architecture

Finly features a universal, multi-currency presentation engine backed by a strict **Scale-100 Minor Integer Unit** ledger:

1. **Supported Currencies**: `USD` ($), `IDR` (Rp), `EUR` (€), `GBP` (£), `SGD` (S$), `AUD` (A$), `CAD` (C$), and `JPY` (¥).
2. **Mathematical Invariant (GEMINI.md Rule #3)**: All ledger money is represented in minor integer units at fixed scale of 100 with zero floating-point arithmetic.
3. **Reactive Synchronization (`useCurrency`)**: Instant, zero-reload cross-tab and cross-component broadcasting when the tenant switches their base currency in Settings.
4. **Dynamic High-Denomination Formatting**: Intelligent integer formatting for currencies like Indonesian Rupiah (`Rp 50.000.000` without cent clutter) and expanded digit capacity up to 13 digits in Quick Entry.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework & Runtime:** [React 19](https://react.dev/) · [Vite](https://vitejs.dev/) · [TypeScript](https://www.typescriptlang.org/) (Strict Mode).
- **Routing & SSR:** [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router) with end-to-end type-safe file-based routing.
- **Serverless & Deployment Engine:** [Nitro](https://nitro.build/) (`nitro/vite`) generating `.output/server` and `.output/public` for zero-config Vercel SSR deployment without 404 routing errors.
- **State Management & Caching:**
  - **Server State:** [TanStack Query v5](https://tanstack.com/query) (`@tanstack/react-query`) with SWR caching, background synchronization, and optimistic UI mutations.
  - **Global & Layout UI State:** [Zustand](https://github.com/pmndrs/zustand).
  - **Subscription State:** Custom reactive subscription store (`src/lib/subscription.ts`) with cross-window event synchronization.
- **Data Tables & Forms:**
  - [TanStack Table v8](https://tanstack.com/table) for high-performance tabular data grids, sorting, and debounced search.
  - [TanStack Form](https://tanstack.com/form) + [Zod](https://zod.dev/) for type-safe form validation and field error formatting.
- **Data Visualizations:** [Recharts](https://recharts.org/) / TanStack Charts with Monotone Bezier Curves and vertical gradient fills.
- **UI Components & Icons:** [Radix UI](https://www.radix-ui.com/) accessible primitives with Popper dropdown positioning and stable scrollbar management, [Lucide Icons](https://lucide.dev/), and [Motion](https://motion.dev/) (Framer Motion) micro-interactions.

---

## 🎨 Design System & Tokens

Finly follows a strict, high-density financial interface philosophy:

1. **100% OLED Pitch Black Dark Mode:**
   - Background (`--background`), cards (`--card`), popovers (`--popover`), and sidebars use pure pitch black (`#101010` / `#000000`).
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
5. **Pointer Consistency & Stable Viewport:**
   - Mandatory `cursor: pointer` on all buttons, interactive pills, tab triggers, clickable table rows, and select controls.
   - `scrollbar-gutter: stable` and popper dropdown anchoring to ensure zero layout shift.

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
│   │   ├── ui/             # Reusable primitives (Buttons, Dialogs, Cards, Badges, Select)
│   │   ├── AiChatAssistant.tsx # Floating AI Copilot drawer
│   │   ├── Layout.tsx      # Application Topbar shell layout
│   │   ├── NotFound.tsx    # 404 Error page component
│   │   └── ThemeToggle.tsx # Dark/Light mode switcher
│   ├── hooks/
│   │   ├── use-ai-chat.ts  # Multi-provider AI streaming hook
│   │   └── use-debounced-search.ts # Debounced search hook
│   ├── lib/
│   │   ├── currency.ts     # Multi-currency configuration & useCurrency hook
│   │   ├── subscription.ts # Subscription store & upgrade events
│   │   └── utils.ts        # Class merging & Tailwind utilities
│   ├── routes/             # File-based TanStack routes
│   │   ├── __root.tsx      # Root layout wrapper (Theme, Modals, Assistant)
│   │   ├── index.tsx       # Direct route redirect to /dashboard
│   │   ├── dashboard.tsx   # Financial Overview 4-row grid
│   │   ├── cashbook.tsx    # Cash ledger with Quick Entry modal
│   │   ├── invoices/       # Invoices index, builder, and $id views
│   │   ├── customers.tsx   # Client directory
│   │   ├── items.tsx       # Product & Service catalog
│   │   ├── settings.tsx    # Workspace settings & AI provider keys
│   │   ├── pricing.tsx     # Pricing plans & Pro upgrade
│   │   └── account.tsx     # Profile & security settings
│   ├── styles/             # Global Tailwind styles & CSS variables
│   ├── main.tsx            # Application entry point & router mounting
│   └── routeTree.gen.ts    # Auto-generated TanStack route tree
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v20.0.0` or higher (LTS recommended)
- **Package Manager:** `npm` (v10+) or `pnpm`

### Installation

```bash
cd finly-web
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will start locally at [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Command                   | Description                                                |
| :------------------------ | :--------------------------------------------------------- |
| `npm run dev`             | Starts the Vite development server on port 3000.           |
| `npm run generate-routes` | Regenerates the TanStack router tree (`routeTree.gen.ts`). |
| `npm run build`           | Compiles client bundle and Nitro serverless output.        |
| `npm run preview`         | Locally previews the production build.                     |
| `npm run lint`            | Runs ESLint checks across TypeScript and TSX files.        |
| `npm run format`          | Formats code with Prettier and automatically fixes lints.  |
| `npm run check`           | Checks code formatting without modifying files.            |

---

## 🧭 Routing & Navigation Architecture

Finly Web uses **TanStack Router** file-based routing:

- **Root Layout (`__root.tsx`):** Injects theme providers, global Modals, and floating AI assistant.
- **Route Definitions:** All routes map 1-to-1 with files in `src/routes/`.
- **Active Navigation State:** Route triggers determine active navigation pills with high-contrast indicator highlights.

---

## 🛡️ Core Engineering Rules & Invariants

1. **Integer Minor Units (Scale 100):**
   - Monetary amounts are strictly integer minor units (`*_in_cents`).
   - Floating-point calculations are strictly forbidden in arithmetic paths.
2. **Session-Derived Multi-Tenancy:**
   - Client never passes tenant IDs in request bodies or query params.
3. **No Overdue Enum:**
   - Overdue status is computed dynamically on the client (`status === 'unpaid' && dueDate < today`).
4. **Snapshot Immutability:**
   - Invoices render permanent snapshot data recorded at issuance.
5. **No Native Browser Modals:**
   - Confirmations and prompts use accessible ShadCN Radix dialog components.

---

## 🚢 Deployment (Vercel)

Finly Web is configured with **Nitro SSR** (`nitro/vite`) for zero-config deployment to Vercel:

1. **Build Command:** `npm run build`
2. **Output Directory:** `.output/public`
3. **Serverless Functions:** Automatically generated in `.output/server` to handle all SSR route requests without 404 redirects.

---

## 🤝 Contributing & Code Quality

1. Match surrounding conventions and avoid introducing redundant UI dependencies.
2. Run `npm run check` and `npm run build` before submitting PRs.
3. Adhere strictly to the design tokens: `shadow-none`, `font-mono` for currency, and `cursor: pointer` on interactive controls.
