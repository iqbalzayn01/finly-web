# Product Requirements Document (PRD)

## Finly — Frontend Web Application

**Document Version:** 2.1.0 (Bento Grid Edition)  
**Document Status:** Approved & Ready for Frontend Implementation  
**Product Type:** Single-Page Web Application (Desktop & Mobile Responsive)  
**Architecture Scope:** Client-Side / Frontend Only (Zero Backend & Zero AI Dependencies)  
**Tech Stack:** React 19, Vite, Tailwind CSS v4, shadcn/ui, TypeScript, IndexedDB / LocalStorage  
**Typography:** Geist Mono (`@fontsource-variable/geist-mono`) across all UI elements, headings, labels, and tabular figures  
**Design Paradigm:** Modern Bento Grid (Asymmetrical Compartments, Bold Typography, Micro-Badges)  
**Grid Gutter Rhythm:** Strict **8px (`gap-2`)** or **16px (`gap-4`)** spacing across all views  
**Color Palette:**

- **Primary (Hero & CTA):** `#C9F31D` (Electric Lime) | Text on Lime: `#111111`
- **App Canvas / Root:** `#111111` (Deep Neutral Black) | Foreground Text: `#FFFFFF`
- **Secondary Surface:** `#27272A` (Zinc 800 Dark) / `#F4F4F5` (Zinc 100 Light)
- **Accent:** `#A78BFA` (Violet 400 - Bold Counter-Hue)
- **Muted Copy:** `#A1A1AA` (Zinc 400)
- **Functional Inflow:** `#34D399` (Emerald 400)
- **Functional Outflow:** `#FB7185` (Rose 400)
- **Functional Warning:** `#FBBF24` (Amber 400)
- **Functional Info/Tooltip:** `#38BDF8` (Sky 400)
  **Balance Privacy:** Small inline toggle icon button (`Eye` / `EyeOff`) situated directly to the right of the Total Balance figure in the Balance Bento Card (Removed from Safe-to-Spend).

---

## 1. Executive Summary & Core Value Proposition

### 1.1 Problem Statement

Modern personal finance tools either overwhelm users with accounting jargon or utilize sterile, generic dashboard templates that lack visual hierarchy. Users need a high-clarity, modern visual experience that provides instant answers:

1. **Total Balance & Privacy:** Real-time cash position with a 1-click inline privacy toggle.
2. **Safe-to-Spend Calculation:** Clear daily spending headroom paced until month-end.
3. **Cashflow Trends:** High-fidelity Area Chart comparing Inflow (`#34D399`) and Outflow (`#FB7185`).
4. **Recent Activity Ledger:** Clean 10-row paginated table with real-time category filtering.
5. **Integrated Invoices:** Native receivable management with instant cashflow settlement.

### 1.2 Bento Grid Design Philosophy

Finly adopts the modern **Bento Grid** aesthetic:

- **Spatial Compartmentalization:** Content is broken into high-contrast rectangular tiles with rounded corners (`rounded-2xl` or `rounded-3xl`) separated by consistent **8px (`gap-2`)** or **16px (`gap-4`)** gutters.
- **Typographic Contrast:** Oversized Geist Mono figures anchored by tiny uppercase micro-labels and status pills.
- **Color Blocking:** Strategic pairing of Electric Lime (`#C9F31D`), Deep Zincs (`#27272A`), Violet (`#A78BFA`), and semantic Emerald/Rose for effortless scanning.

---

## 2. Global Shell & Navigation Architecture

```
+----------------------------------------------------------------------------------------------------------+
|  (*) FINLY                      [ Dashboard ]   [ History ]   [ Invoices ]            (🌙)  (🔔)  [AZ v] |
+----------------------------------------------------------------------------------------------------------+
|  <--- TOP BAR: PURE WHITE / BORDERLESS (bg-white dark:bg-zinc-950 border-none) ------------------------>  |
|                                                                                                          |
|  +-- MAIN CONTAINER: WHITE SURFACE WITH ROUNDED TOP CORNERS (rounded-t-[32px] sm:rounded-t-[40px]) ----+  |
|  |                                                                                                    |  |
|  |  [ BENTO GRID MATRIX: gap-2 (8px) on mobile | gap-4 (16px) on desktop ]                            |  |
|  |                                                                                                    |  |
|  +----------------------------------------------------------------------------------------------------+  |
```

### 2.1 Top Bar Specification

- **Background & Border:** Pure white (`bg-white dark:bg-zinc-950`), zero border (`border-none`), zero divider.
- **Left:** Brand Logo (Geometric 8-pointed spark in `#C9F31D` or monochrome) + "Finly" wordmark in Geist Mono.
- **Center (Desktop Navigation):**
  - Minimalist pill container:
    - **Dashboard** (`/`)
    - **History** (`/history`)
    - **Invoices** (`/invoices`)
  - Active Tab: High-contrast pill (`bg-[#C9F31D] text-[#111111]` or `bg-white text-zinc-900`).
- **Right Controls:** Theme Toggle, Notification Popover, and User Profile Dropdown (`[AZ]`). Settings is accessed via the User Profile dropdown.

---

## 3. Main Dashboard Bento Grid Specification (`/`)

The Dashboard canvas organizes all cashflow metrics inside an asymmetrical 12-column Bento Grid with a strict **16px desktop gap (`gap-4`)** and **8px mobile gap (`gap-2`)**:

```
+-----------------------------------------------------------------------------------------------------------------+
|  OCTOBER 2026 CASHFLOW                                                                 [+ Record Transaction]   |
+-----------------------------------------------------------------------------------------------------------------+
|                                                                                                                 |
|  +-- BENTO TILE 1: TOTAL BALANCE ---+  +-- BENTO TILE 2: SAFE-TO-SPEND -----+  +-- BENTO TILE 3: INFLOW/OUTFLOW -+  |
|  | [col-span-12 md:col-span-4]      |  | [col-span-12 md:col-span-4]        |  | [col-span-12 md:col-span-4]    |  |
|  | TOTAL BALANCE                    |  | SAFE-TO-SPEND TODAY                |  | TOTAL CASH SUMMARY             |  |
|  |                                  |  |                                    |  |                                |  |
|  | $4,250.00  [👁]                  |  | $45.00 / day                       |  | In:  +$8,500.00 (#34D399)      |  |
|  | (*Eye icon toggles $••••••*)     |  | (Paced for 21 days remaining)      |  | Out: -$4,250.00 (#FB7185)      |  |
|  | 2 Accounts Active                |  | [=========== 68% ============]     |  | Net: +$4,250.00 (Surplus)      |  |
|  |                                  |  | Primary Lime Surface (#C9F31D)     |  | Accent Violet Border (#A78BFA) |  |
|  +----------------------------------+  +------------------------------------+  +--------------------------------+  |
|                                                                                                                 |
|  +-- BENTO TILE 4: INTERACTIVE AREA CHART ----------------------------------+  +-- BENTO TILE 5: QUICK INSIGHT -+  |
|  | [col-span-12 lg:col-span-8]                                              |  | [col-span-12 lg:col-span-4]    |  |
|  | CASHFLOW DYNAMICS                            Range: [1W] [1M] [3M] [1Y]  |  | UNPAID RECEIVABLES             |  |
|  |                                                                          |  |                                |  |
|  |  $10k |  .:'""`:.                                                        |  | 3 Invoices Pending             |  |
|  |   $8k | :         `:.       [Tooltip Popover - Oct 14]                   |  | $3,450.00                      |  |
|  |   $6k | : Income   `:.      ┌────────────────────────────┐               |  |                                |  |
|  |   $4k | : (#34D399) :.      │ Date: Oct 14, 2026         │               |  | Overdue: $450.00 (#FB7185)     |  |
|  |   $2k | : Expenses   `:.    │ Inflow:     +$2,000.00     │               |  |                                |  |
|  |    $0 +-: (#FB7185) ..:.....│ Outflow:       -$180.00    │─────────────> |  | [View Invoices ↗]              |  |
|  |        Oct 01     Oct 08    └────────────────────────────┘  Oct 31       |  |                                |  |
|  +--------------------------------------------------------------------------+  +--------------------------------+  |
|                                                                                                                 |
|  +-- BENTO TILE 6: RECENT TRANSACTIONS LEDGER (10 ROWS STRICT PAGINATION) ------------------------------------+  |
|  | [col-span-12]                                                                                               |  |
|  | RECENT ACTIVITY                             Filters: [ All (14) ]  [ Inflow (#34D399) ]  [ Outflow (#FB7185) ] |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | TRANSACTION / NOTE              CATEGORY               DATE          WALLET ACCOUNT          AMOUNT        |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | Specialty Coffee Roasters       Food & Personal        Today         Checking Account        -$4.50        |  |
|  | UI Design Retainer              Client Invoices        Yesterday     Business Checking    +$2,000.00       |  |
|  | Cloud Server Hosting            Software & Tools       Oct 28        Checking Account       -$25.00        |  |
|  | Coworking Hot Desk              Workspace              Oct 25        Business Checking     -$180.00        |  |
|  | Weekly Organic Groceries        Groceries              Oct 24        Checking Account       -$64.20        |  |
|  | Figma Subscription              Software & Tools       Oct 22        Business Checking      -$15.00        |  |
|  | Gas Station Fill-up             Commute & Fuel         Oct 21        Checking Account       -$42.00        |  |
|  | Brand Sprint Payment            Client Invoices        Oct 18        Business Checking    +$1,200.00       |  |
|  | Client Strategy Lunch           Dining & Personal      Oct 17        Checking Account       -$58.00        |  |
|  | Internet Fiber Line             Utilities              Oct 15        Checking Account       -$50.00        |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | Showing 1 - 10 of 14 records                                       [< Previous]  Page 1 of 2  [Next >]      |  |
|  +------------------------------------------------------------------------------------------------------------+  |
```

### 3.1 Detailed Bento Tile Specifications

#### Tile 1: Total Balance Card (Privacy Toggle Enabled)

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** `#27272A` (Dark Zinc) with `#FFFFFF` primary text.
- **Inline Eye Toggle Button:** Located immediately to the right of the balance amount.
  - Clicking toggles between `$4,250.00` and `$ ••••••`.
  - Visual Icon: `Eye` (visible) or `EyeOff` (masked) in neutral `#A1A1AA`, hover state `#FFFFFF`.
- **Footer:** Active accounts indicator.

#### Tile 2: Safe-to-Spend Tile (Privacy Toggle Removed)

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** High-contrast Electric Lime (`#C9F31D`) with Deep Black (`#111111`) text.
- **Content:**
  - Header: `DAILY SAFE-TO-SPEND` with pill badge showing `21D LEFT`.
  - Oversized Geist Mono value: `$45.00 / day`.
  - Progress budget bar rendered in `#111111`/20 with solid black fill.
  - _Notice: The hide balance button is completely removed from this card._

#### Tile 3: Total Inflow & Outflow Summary Tile

- **Grid Span:** `col-span-12 md:col-span-4`.
- **Surface:** `#27272A` with Accent Violet (`#A78BFA`) corner badge or border highlight.
- **Content:**
  - Income row: `+$8,500.00` highlighted in Emerald 400 (`#34D399`).
  - Expenses row: `-$4,250.00` highlighted in Rose 400 (`#FB7185`).
  - Net Cash Position: `+$4,250.00` (Surplus).

#### Tile 4: Interactive Area Chart Tile

- **Grid Span:** `col-span-12 lg:col-span-8`.
- **Surface:** `#27272A` (or light secondary `#F4F4F5` in light mode).
- **Filters:** Interactive pills (`1W`, `1M`, `3M`, `6M`, `1Y`).
- **Visuals:**
  - Income series gradient: Emerald (`#34D399`).
  - Expenses series gradient: Rose (`#FB7185`).
  - Interactive Tooltip popover: Elevated pill with `#38BDF8` (Sky) accents showing date and breakdown.

#### Tile 5: Receivables & Invoices Glance Tile

- **Grid Span:** `col-span-12 lg:col-span-4`.
- **Surface:** `#27272A` with link arrow (`↗`) to `/invoices`.
- **Content:** Unpaid invoices count (3), total expected receivable (`$3,450.00`), and overdue alerts flagged in Rose (`#FB7185`).

#### Tile 6: Recent Transactions Bento Ledger

- **Grid Span:** `col-span-12`.
- **Surface:** `#27272A` (or clean secondary container).
- **Pagination:** Strictly **10 rows per page** with Previous/Next controls.
- **Filter Pills:** `All`, `Inflow (#34D399)`, `Outflow (#FB7185)`.

---

## 4. Invoicing Module Bento Layout (`/invoices`)

The Invoices view implements the same Bento layout:

```
+-----------------------------------------------------------------------------------------------------------------+
|  INVOICES & RECEIVABLES                                                                 [+ Create New Invoice]  |
+-----------------------------------------------------------------------------------------------------------------+
|  +-- BENTO STAT 1: UNPAID ----------+  +-- BENTO STAT 2: OVERDUE -----------+  +-- BENTO STAT 3: COLLECTED ---+  |
|  | WAITING TO BE PAID               |  | OVERDUE (NEEDS ACTION)             |  | PAID THIS MONTH              |  |
|  | $3,450.00                        |  | $450.00                            |  | $2,100.00                    |  |
|  | 3 Invoices Pending               |  | 1 Client Late                      |  | 2 Invoices Collected         |  |
|  | Surface: #27272A                 |  | Surface: #FB7185 / Dark Tint       |  | Surface: #34D399 / Dark Tint |  |
|  +----------------------------------+  +------------------------------------+  +------------------------------+  |
|                                                                                                                 |
|  +-- BENTO TABLE: INVOICES LIST (gap-4 rhythm) ---------------------------------------------------------------+  |
|  | Filters: [ All (6) ]  [ Unpaid (3) ]  [ Overdue (1) ]  [ Paid (2) ]  [ Drafts (0) ]                         |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | CLIENT / PROJECT         INVOICE #     DUE DATE        AMOUNT       STATUS        ACTIONS                  |  |
|  | ---------------------------------------------------------------------------------------------------------- |  |
|  | Acme Design Studio       INV-004       In 3 days       $1,500.00    [SENT]        [Mark Paid]  [Share]     |  |
|  | Budi Bakery Shop         INV-003       2 days ago      $450.00      [OVERDUE]     [WhatsApp]   [Share]     |  |
|  | Global Media Corp        INV-002       Nov 20, 2026    $1,500.00    [SENT]        [Mark Paid]  [Share]     |  |
|  | Startup Lab Inc          INV-001       Oct 15, 2026    $2,100.00    [PAID]        [Download]   [...]       |  |
|  +------------------------------------------------------------------------------------------------------------+  |
```

### 4.1 "Mark as Paid" Flow

Clicking **[Mark Paid]** triggers the native shadcn/ui `Dialog`. Confirming updates the invoice to `PAID`, automatically adds a `+$X,XXX.XX` Inflow transaction to the ledger, and recalculates the Balance and Safe-to-Spend limits instantly.

---

## 5. Modal Dialogs Architecture (shadcn/ui Dialog)

All record and invoice creation workflows use native shadcn/ui `Dialog` components styled with dark zinc surfaces (`#27272A`) and Electric Lime CTA buttons:

```
+-------------------------------------------------------------------+
|  Record Transaction                                           [X] |
+-------------------------------------------------------------------+
|  Log money moving into or out of your cashflow.                   |
|                                                                   |
|  TRANSACTION TYPE:                                                |
|  [ Money Out (Expense) ]              [ Money In (Income) ]       |
|                                                                   |
|  AMOUNT (USD):                                                    |
|  [ $ 0.00                                                       ] |
|                                                                   |
|  CATEGORY:                                                        |
|  [ Food & Personal                                            v ] |
|                                                                   |
|  WALLET ACCOUNT:                                                  |
|  [ Main Checking Account                                      v ] |
|                                                                   |
|  DATE:                                                            |
|  [ 2026-10-31                                                   ] |
|                                                                   |
|  NOTE / DESCRIPTION (Optional):                                   |
|  [ e.g., Wholesale packaging restock                            ] |
|                                                                   |
|  ---------------------------------------------------------------- |
|  [ Cancel ]                        [ Save Transaction (#C9F31D) ] |
+-------------------------------------------------------------------+
```

---

## 6. Frontend Acceptance Criteria (Definition of Done)

- [ ] **Bento Grid Layout:** Implemented on all pages using an asymmetrical CSS grid with strict **8px (`gap-2`)** or **16px (`gap-4`)** gutters.
- [ ] **Inline Hide Balance:** The hide balance toggle button (`Eye` / `EyeOff`) is located directly adjacent to the numeric balance string in the Balance Bento Card.
- [ ] **Safe-to-Spend Card Cleaned:** No hide balance button is present on the Safe-to-Spend card.
- [ ] **Color Palette Standards:**
  - Primary: Electric Lime `#C9F31D` (with `#111111` text).
  - Canvas Root: Deep Black `#111111` (with `#FFFFFF` text).
  - Secondary Surfaces: Zinc 800 `#27272A` (dark) and Zinc 100 `#F4F4F5` (light).
  - Accent: Violet 400 `#A78BFA`.
  - Income: Emerald 400 `#34D399`.
  - Expense: Rose 400 `#FB7185`.
  - Warning: Amber 400 `#FBBF24`.
  - Info: Sky 400 `#38BDF8`.
- [ ] **Geist Mono Standard:** All labels, headers, numbers, and inputs render in Geist Mono.
- [ ] **Interactive Area Chart:** Dual gradient fills for Income (`#34D399`) and Expenses (`#FB7185`), with time-range filters (`1W`, `1M`, `3M`, `6M`, `1Y`) and interactive tooltips.
- [ ] **10-Row Transactions Table:** Recent activity ledger strictly paginates at 10 items per page with category filters (`All`, `Income`, `Expenses`).
- [ ] **Invoice Settlement:** "Mark as Paid" action opens a confirmation dialog and deposits funds directly into the cashflow ledger.
