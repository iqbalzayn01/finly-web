# Product Requirements Document (PRD)

## Finly — Frontend Web Application

**Document Version:** 3.0.0 (Rounded Brutalism & Glassmorphism Bento Edition)  
**Document Status:** Implemented (`feat/v2-web-release-3.0.0`)  
**Product Type:** Full-Stack Client-First Web Application (Desktop & Mobile Responsive)  
**Architecture Scope:** Client-Side Workspace Persistence (Zero Backend & Zero AI Dependencies; LocalStorage / IndexedDB via `src/lib/storage.ts`)  
**Tech Stack:** React 19, TanStack Start, TanStack Router, TanStack Query, Vite 8, Tailwind CSS v4, shadcn/ui (Radix UI & Base UI), Recharts, Lucide React, TypeScript, Biome  
**Typography:** Geist Mono Variable (`@fontsource-variable/geist-mono`) across all UI elements, headings, labels, and tabular figures  
**Design Paradigm:** Rounded Brutalism + Glassmorphism Bento Grid (2px Solid Borders, Static Offset Shadows, Translucent Frosted Cards, Radial Ambient Gradient)  
**Grid Gutter Rhythm:** Strict **16px (`gap-4`)** desktop Bento matrix spacing across primary views  
**Color Palette:**

- **Primary (Hero & CTA):** `#C9F31D` (Electric Lime) | Hover: `#B8E016` | Text on Lime: `#111111`
- **Tertiary (Utility, Focus, Transfers & Invoice Status):** `#6366F1` (Indigo 500) | Hover: `#818CF8`
- **App Canvas / Root:** `#111111` (Dark Default) / `#FFFFFF` (Light Mode)
- **Foreground Text:** `#FFFFFF` (Dark) / `#111111` (Light)
- **Glass Surfaces:**
  - Cards (`.bento-card`): `rgba(30, 30, 36, 0.55)` (Dark) / `rgba(255, 255, 255, 0.65)` (Light) with `backdrop-blur-xs`
  - Header (`.glass-header`): `rgba(17, 17, 17, 0.65)` (Dark) / `rgba(255, 255, 255, 0.25)` (Light) with `backdrop-blur-md`
  - Popovers/Dialogs: `rgba(24, 24, 28, 0.82)` (Dark) / `rgba(255, 255, 255, 0.85)` (Light)
- **Muted Copy:** `#A1A1AA` (Dark) / `#52525B` (Light)
- **Functional Inflow:** `#34D399` (Emerald 400)
- **Functional Outflow:** `#FB7185` (Rose 400)
- **Functional Warning:** `#FBBF24` (Amber 400)
- **Functional Info / Tooltip:** `#38BDF8` (Sky 400)
- **Balance Privacy:** Inline toggle icon button (`Eye` / `EyeOff`) situated directly to the right of the Total Balance figure in `TotalBalanceBentoTile` (absent from `SafeToSpendHero`).

---

## 1. Executive Summary & Core Value Proposition

### 1.1 Problem Statement

Modern personal finance tools either overwhelm users with accounting jargon or rely on sterile, generic dashboard templates that lack clear visual hierarchy. Finly provides freelancers, creators, employees, and micro-businesses with plain-language cashflow clarity and instant answers:

1. **Total Balance & Wallet Filtering:** Real-time cash position highlighted on the Electric Lime hero tile with a 1-click inline privacy toggle (`Eye` / `EyeOff`) and interactive per-wallet filter chips.
2. **Safe-to-Spend Calculation:** Daily spending allowance paced across remaining days in the monthly cycle, paired with a visual headroom bar and monthly discretionary pool.
3. **Monthly Cashflow Summary:** Net cash position paired with side-by-side Inflow (`#34D399`) and Outflow (`#FB7185`) breakdowns.
4. **Cashflow Dynamics Chart:** Interactive Recharts area chart (`1W`, `1M`, `3M`, `6M`, `1Y`) comparing Inflow and Outflow with privacy-blur support.
5. **Recent Activity Ledger:** 10-row paginated activity table with category-matched Lucide icons, inflow/outflow/all filters, and instant delete controls.
6. **Integrated Client Invoicing:** Receivable tracking, invoice creation, WhatsApp/clipboard sharing, Print/PDF export (excluding modal chrome/close buttons via `.no-print`), and 1-click cashflow settlement.

### 1.2 Rounded Brutalism & Glassmorphism Bento Philosophy

Finly combines tactile **Rounded Brutalism** with optical **Glassmorphism** over a dual **Radial Ambient Gradient** (`.ambient-gradient-blur` blending Lime `#C9F31D` and Indigo `#6366F1` at the top of the viewport):

- **Spatial Compartmentalization:** Content sits in modular, single-responsibility Bento tiles (`rounded-3xl`, `2px` border, static `4px 4px` offset shadow) inside a 12-column grid (`gap-4`).
- **Modular Tile Ownership:** Each dashboard tile lives in its own dedicated component under `src/components/dashboard/` (`TotalBalanceBentoTile`, `SafeToSpendHero`, `CashSummaryBentoTile`, `CashflowTrendChart`, `ReceivablesBentoTile`, `RecentTransactionsCard`).
- **Color Hierarchy:** Electric Lime (`#C9F31D`) spotlights the Total Balance card and primary CTAs; Indigo (`#6366F1`) marks interactive focus states, utility buttons, wallet filter states, pending invoice tags, and internal transfers; Emerald/Rose represent operational inflows and outflows.

---

## 2. Global Shell & Navigation Architecture (`src/components/layout/app-shell.tsx`)

```
+----------------------------------------------------------------------------------------------------------+
|  [*] Finly                 [ Dashboard | History | Invoices ]        [Search ⌘K]  (☀/🌙)  (🔔)  [AZ]    |
+----------------------------------------------------------------------------------------------------------+
|  <--- STICKY GLASS HEADER (.glass-header sticky top-0 z-40, borderless, backdrop-blur-md) -------------> |
|                                                                                                          |
|  +-- MAIN CONTAINER (max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 over fixed radial .ambient-gradient-blur) ---+  |
|  |                                                                                                    |  |
|  |  [ 12-COLUMN BENTO GRID MATRIX: gap-4 ]                                                            |  |
|  |                                                                                                    |  |
|  +----------------------------------------------------------------------------------------------------+  |
|  <--- MOBILE BOTTOM DOCK (< 768px, fixed bottom-0 h-18): [Home] [History]  (+)  [Invoices] [Settings] -> |
+----------------------------------------------------------------------------------------------------------+
```

### 2.1 Top Navigation Bar Specification

- **Position & Surface:** Sticky header (`sticky top-0 z-40 w-full`) using `.glass-header` (`backdrop-blur-md`, borderless). Hidden on print via `.no-print`.
- **Left Zone:** `BrandLogo` inside a `brutal-surface` Electric Lime icon container (`fill-black`) + `Finly` wordmark in Geist Mono.
- **Center Zone (`md:flex`):** Pill container (`brutal-surface rounded-2xl bg-card p-1`) hosting:
  - **Dashboard** (`/`)
  - **History** (`/history`)
  - **Invoices** (`/invoices`, conditionally shown when `isInvoicingVisible` is enabled)
  - Active Tab: `bg-primary text-primary-foreground border-border font-extrabold`.
- **Right Zone Controls:**
  - **Command Search (`⌘K`):** Opens `CommandSearchDialog` to jump across transactions, invoices, or trigger quick entry.
  - **Theme Switcher:** Single button toggling light/dark modes via `next-themes`. Uses `dark:hidden` (`Sun`) and `hidden dark:block` (`Moon`) so icons never overlap on hover.
  - **Notifications Popover:** Bell button with an alert dot (`bg-outflow` for overdue/deficit alerts, `bg-primary` for upcoming/healthy notices) displaying overdue/unpaid invoices and Safe-to-Spend status.
  - **Account/Profile Dropdown (`modal={false}`):** Non-modal Radix `DropdownMenu` (prevents body scroll-lock layout shifts on the sticky header) with display name, email, inline **Hide Balances** `Switch`, **Settings** (`/settings`), **Export CSV**, and **Sign Out** (`/login`).

### 2.2 Mobile Bottom Navigation (`< 768px`)

- Fixed bottom glass dock (`h-18`, `.glass-header`, `.no-print`) featuring icon-only route links with `aria-label`s (**Home**, **History**, **Invoices**, **Settings**) flanking a central elevated Electric Lime `+` Quick Transaction button.

---

## 3. Main Dashboard Bento Grid Specification (`/`, `src/routes/index.tsx`)

The Dashboard header displays the current month overview (`{Month Year} Overview`) and a desktop **[+ Add Transaction]** button (`hidden md:flex`). Below it sits the 12-column Bento Grid (`gap-4`):

- **Optional Deficit Banner (`col-span-12`):** Rendered above Row 1 when `totalCashOnHand < 0 || safeToSpend.status === 'deficit'`, offering a direct link to `/history?sort=largest`.

```
+-----------------------------------------------------------------------------------------------------------------+
|  NOVEMBER 2026 OVERVIEW                                                                   [+ Add Transaction]   |
+-----------------------------------------------------------------------------------------------------------------+
|  +-- TILE 1: TOTAL BALANCE ---------+  +-- TILE 2: SAFE-TO-SPEND -------+  +-- TILE 3: THIS MONTH -----------+  |
|  | [col-span-12 md:col-span-4]      |  | [col-span-12 md:col-span-4]   |  | [col-span-12 md:col-span-4]     |  |
|  | Surface: Primary Lime (#C9F31D)  |  | Surface: Glass Card (bg-card)  |  | Surface: Glass Card (bg-card)   |  |
|  | TOTAL BALANCE            [Live]  |  | SAFE TO SPEND TODAY [21d left] |  | THIS MONTH          [Positive]  |  |
|  |                                  |  |                                |  |                                 |  |
|  | $4,250.00                 [👁]   |  | $45.00 / day                   |  | $4,250.00                       |  |
|  | Cash across all 2 wallets        |  | On track to stay within budget |  | Saved so far this month         |  |
|  | [All (2)] [Business] [Checking]  |  | [Free to spend 68%] [Lime bar] |  | [↗ In: $8.5k]  [↘ Out: $4.25k]  |  |
|  | -------------------------------- |  | ------------------------------ |  | ------------------------------- |  |
|  | Safety buffer         $1,200.00  |  | Available this month  $XXX.XX  |  | Recorded this month 16 entries  |  |
|  +----------------------------------+  +--------------------------------+  +---------------------------------+  |
|                                                                                                                 |
|  +-- TILE 4: CASHFLOW TREND CHART (CashflowTrendChart) ---------------------+  +-- TILE 5: RECEIVABLES ------+  |
|  | [col-span-12 lg:col-span-8]                                              |  | [col-span-12 lg:col-span-4] |  |
|  | INCOME VS. EXPENSES                         [1W] [1M] [3M] [6M] [1Y]     |  | UNPAID INVOICES             |  |
|  | Dual Emerald (#34D399) & Rose (#FB7185) AreaChart + Net Tooltip          |  | 3 unpaid invoices           |  |
|  |                                                                          |  | $3,450.00                   |  |
|  |                                                                          |  | [Overdue breakdown]         |  |
|  |                                                                          |  | [Paid This Month breakdown] |  |
|  |                                                                          |  | [Manage Invoices ↗] (Indigo)|  |
|  +--------------------------------------------------------------------------+  +-----------------------------+  |
|                                                                                                                 |
|  +-- TILE 6: RECENT ACTIVITY LEDGER (RecentTransactionsCard, 10 ROWS PER PAGE) -------------------------------+  |
|  | [col-span-12]                                                                                               |  |
|  | RECENT ACTIVITY                                            [ All (N) ] [ Income (N) ] [ Expenses (N) ]      |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | DESCRIPTION (Category Icon)     CATEGORY               DATE          WALLET            AMOUNT       ACTION  |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | [🍴] Specialty Coffee Roasters  Food & Personal        Today         Checking Debit    -$4.50       [🗑]   |  |
|  | [📄] UI Design Retainer         Client Invoices        Yesterday     Business Bank     +$5,300.00   [🗑]   |  |
|  | [💻] Cloud Server Hosting       Software & Tools       ...           Checking Debit    -$125.00     [🗑]   |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | Showing 1–10 of N items                                            [< Previous]  Page 1 of M  [Next >]     |  |
|  +------------------------------------------------------------------------------------------------------------+  |
```

### 3.1 Detailed Bento Tile Specifications

#### Tile 1: Total Balance Bento Card (`src/components/dashboard/total-balance-bento-tile.tsx`)

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** **Primary Electric Lime (`bg-primary text-primary-foreground`)** (`#C9F31D` / `#111111`).
- **Content:**
  - Header: `terminology.netBalance` + high-contrast `"Live"` pill badge.
  - Primary numeric balance + inline **`Eye` / `EyeOff` privacy toggle button** immediately to the right.
  - Wallet filter chips (`All (N)` and per-wallet chips) that scope the Total Balance card, Cashflow Trend Chart, Cash Summary, and Recent Activity table.
  - Footer: `Safety buffer` (`profile.emergencyBuffer`).

#### Tile 2: Safe-to-Spend Today (`src/components/dashboard/safe-to-spend-hero.tsx`)

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** **Glass Surface (`bg-card text-foreground`)**.
- **Content:**
  - Header: `SAFE TO SPEND TODAY` with `{daysRemainingInCycle}d left` pill badge.
  - Daily limit figure (`$XX.XX / day`) + dynamic status message (`healthy`, `caution`, or `deficit`).
  - Headroom progress block (`bg-background` container with `bg-muted/25` track and **Primary Lime `bg-primary`** fill bar).
  - Footer: `Available this month` (`discretionaryPool`).
  - _No privacy toggle button on this tile._

#### Tile 3: This Month Summary (`src/components/dashboard/cash-summary-bento-tile.tsx`)

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** **Glass Surface (`bg-card text-foreground`)**.
- **Content:**
  - Header: `THIS MONTH` + status pill (`Positive` in Emerald or `Over Spent` in Rose).
  - Net flow figure in neutral `text-foreground` + contextual summary copy.
  - Side-by-side `bg-background` boxes for Inflow (`ArrowUpRight` + `#34D399`) and Outflow (`ArrowDownRight` + `#FB7185`).
  - Footer: `Recorded this month` (`{count} entries`).

#### Tile 4: Cashflow Trend Chart (`src/components/dashboard/cashflow-trend-chart.tsx`)

- **Grid Span:** `col-span-12 lg:col-span-8`.
- **Surface:** **Glass Surface (`bg-card`)**.
- **Controls:** Time-range pill switcher (`1W`, `1M`, `3M`, `6M`, `1Y`) inside a `bg-background brutal-surface` container; active pill uses `bg-primary text-primary-foreground`.
- **Visuals:** Recharts `AreaChart` with Emerald (`#34D399`) Inflow and Rose (`#FB7185`) Outflow gradient fills, interactive net-flow tooltip, and `.privacy-masked` blur when privacy mode is enabled.

#### Tile 5: Receivables Quick Insight (`src/components/dashboard/receivables-bento-tile.tsx`)

- **Grid Span:** `col-span-12 lg:col-span-4`.
- **Surface:** **Glass Surface (`bg-card`)**.
- **Content:** Waiting invoice count (`Clock` info icon), total pending receivable (`waitingAmount`), Overdue alert row (`TriangleAlert`), Paid This Month row (`CheckCircle2`), and full-width Indigo-accented **`Manage Invoices ↗`** CTA button linking to `/invoices`.

#### Tile 6: Recent Activity Ledger (`src/components/dashboard/recent-transactions-card.tsx`)

- **Grid Span:** `col-span-12`.
- **Surface:** **Glass Surface (`bg-card`)**.
- **Filter Tabs:** `All`, `Income`/`Cash In`, `Expenses`/`Cash Out` with live counts.
- **Category-Matched Icons (`getCategoryIcon`):** Replaces generic arrows with semantic Lucide icons matched to category keywords (`Utensils`, `ShoppingCart`, `Laptop`, `Building2`, `Car`, `Zap`, `Wrench`, `ReceiptText`, `FileText`, `Briefcase`, `TrendingUp`, `Coins`, `ArrowLeftRight` for internal transfers, and `ArrowUpRight`/`ArrowDownRight` fallbacks).
- **Pagination:** Strictly **10 rows per page (`PAGE_SIZE = 10`)** with Previous/Next controls and an Electric Lime active page indicator (`Page X of Y`).

---

## 4. Secondary Routes & Workflows

### 4.1 Transaction History (`/history`, `src/routes/history.tsx`)

- Full searchable, filterable (type, category, wallet), and sortable (`recent` / `largest`) transaction ledger with 10-row pagination, CSV export, and monthly summary KPIs.

### 4.2 Client Invoices (`/invoices`, `src/routes/invoices.tsx`)

- **3 Bento Stat Cards (`sm:col-span-4`):**
  1. `Waiting to Be Paid` (`Clock` icon with muted-foreground border)
  2. `Overdue` (`TriangleAlert` icon with muted-foreground border)
  3. `Paid This Month` (`CheckCircle2` icon with muted-foreground border)
- **Invoices Table (`col-span-12`):** Status filter tabs (`All`, `Unpaid`, `Overdue`, `Paid`, `Drafts`), search bar, `#INV-xxx` Indigo tags, status badges, and actions:
  - **Create Invoice (`CreateInvoiceModal`):** Multi-line item builder, tax rate, due-term presets, Save Draft, Print/PDF, or Save & Share.
  - **Mark as Paid (`SettleInvoiceDialog`):** Records an inflow transaction into the selected wallet and updates Balance / Safe-to-Spend immediately.
  - **Preview & Print / PDF (`InvoicePreviewDialog`):** Printable invoice sheet with clipboard copy, WhatsApp share (`buildWhatsAppInvoiceUrl`), and `window.print()`. Modal header and `<DialogClose>` button are excluded from print/PDF via `.no-print` (`display: none !important` in `@media print`).

### 4.3 Settings (`/settings`, `src/routes/settings.tsx`)

- Tabbed configuration workspace covering **Profile & Cashflow Rules** (emergency buffer, baseline daily target), **Wallets**, **Display** (Light/Dark/System `RadioGroup`, currency, plain-language toggle, privacy blur), **Invoice Payment Details**, and **Data Management** (JSON/CSV export, empty reset confirmation dialog, demo workspace restore).

### 4.4 Authentication Views (`/login`, `/signup`)

- Standalone split-screen layouts rendered without `AppShell` navigation, featuring `BrandLogo`, local workspace sign-in/registration forms, and the ambient radial background.

---

## 5. Modal & Dialog Architecture

All interactive dialogs (`QuickTransactionModal`, `CreateInvoiceModal`, `SettleInvoiceDialog`, `InvoicePreviewDialog`, `CommandSearchDialog`, and Settings Reset `Dialog`) follow unified standards:
- Surface: `brutal-surface rounded-3xl border-2 border-border bg-popover/80 p-6`
- Close Controls: `showCloseButton={false}` paired with an explicit top-right `<DialogClose asChild>` `icon-xs` button (`<X />`).
- Focus Management: Tertiary Indigo (`#6366F1`) focus rings across inputs, selects, and textareas.

---

## 6. Acceptance Checklist (v3.0.0)

- [x] **Modular Bento Architecture:** Top-row cards separated into `TotalBalanceBentoTile`, `SafeToSpendHero`, and `CashSummaryBentoTile`.
- [x] **Color Blocking & Hierarchy:** `TotalBalanceBentoTile` rendered in Electric Lime (`#C9F31D`), `SafeToSpendHero` in glass `bg-card` with Lime progress fill, and Tertiary Indigo (`#6366F1`) applied strictly to utility controls, focus states, invoice tags/actions, and transfers.
- [x] **Radial Ambient Blur & Glassmorphism:** Pure radial gradients (`.ambient-gradient-blur`) diffused behind `.glass-header` and `.bento-card` surfaces.
- [x] **Sticky Topbar & Non-Shifting Profile Menu:** Sticky glass topbar + non-modal `DropdownMenu` (`modal={false}`) preventing body scroll-lock layout shifts.
- [x] **Non-Overlapping Theme Toggle:** `dark:hidden` / `hidden dark:block` preventing hover-scale SVG collisions.
- [x] **Category-Matched Icons in Recent Activity:** Dynamic Lucide category icons with zero redundant JSX comments.
- [x] **Clean Print / PDF Invoices:** `.no-print` applied to both the dialog header wrapper and Close button in `InvoicePreviewDialog`.
