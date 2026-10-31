# Product Requirements Document (PRD)

## Finly — Frontend Web Application
**Document Version:** 2.0.0 (Unified Minimalist Neumorphic Edition)  
**Document Status:** Approved & Ready for Frontend Implementation  
**Product Type:** Single-Page Web Application (Desktop & Mobile Responsive)  
**Architecture Scope:** Client-Side / Frontend Only (Zero Backend & Zero AI Dependencies)  
**Tech Stack:** React 19, Vite, Tailwind CSS v4, shadcn/ui, TypeScript, IndexedDB / LocalStorage  
**Typography:** Geist Mono (`@fontsource-variable/geist-mono`) across all UI elements, headings, labels, and tabular financial data  
**Color Palette:** Monochromatic Neutral Scale (White, Gray, Deep Black) across all components and logo; Semantic Emerald & Rose reserved strictly for charts  
**Design Aesthetic:** Simple, Modern, Minimalist, Neumorphism (soft extruded elevation, inset active states, smooth tactile geometry)  
**Top Bar Layout:** Pure White background (`bg-white dark:bg-zinc-950`), completely borderless (`border-none shadow-none`)  
**Main Content Container:** Pure White surface (`bg-white dark:bg-zinc-900`) with rounded top-left and top-right corners (`rounded-t-[32px] sm:rounded-t-[40px]`)  
**Currency Standard:** US Dollar (`$`) enforced globally  
**Dialog Standard:** Native shadcn/ui `Dialog` primitives  
**Chart Standard:** Official shadcn/ui Area Chart - Interactive with gradient area fills and point-level tooltips  

---

## 1. Executive Summary & Core Value Proposition

### 1.1 Problem Statement
Most cashflow tracking tools are either bogged down by complex accounting setups (double-entry ledgers, reconciliation steps, multiple persona modes) or suffer from visual clutter. Users want a clean, unified tool that immediately answers three core questions:
1. **What is my actual cash Balance right now?**
2. **How do my Income and Expenses compare across time on an intuitive interactive Area Chart (`1W`, `1M`, `3M`, `6M`, `1Y`)?**
3. **What recent transactions occurred, and how much can I safely spend each day?**

### 1.2 Product Vision
Finly is a unified, clutter-free cashflow tool built on **Minimalist Neumorphic Clarity**. It eliminates artificial user persona gates (no switching modes between freelancer, employee, or business) and provides one universal, frictionless workspace:
* **Balance:** Net cash available right now across all logged funds.
* **Income & Expenses:** Direct, plain-language cash in and cash out.
* **Safe-to-Spend:** Calculated daily limit to maintain positive cashflow.
* **Interactive Area Chart:** Visual cash trend with interactive time filters and point-level tooltips.
* **Paginated Transactions Feed:** Filterable activity ledger with a strict 10-item limit per page.
* **Integrated Invoicing:** Streamlined billing with a direct "Mark as Paid" deposit flow.

### 1.3 Core Ergonomic & Frontend Principles
* **Single Unified Workspace:** No persona toggles or mode switches. Every user gets the same clean, powerful financial dashboard.
* **Geist Mono Everywhere:** Every UI element, button, table header, memo, and numeric figure is rendered in Geist Mono for architectural consistency and tabular alignment.
* **Monochrome Neutral UI:** Buttons, badges, cards, navigation items, and the brand logo use a neutral grayscale palette (Zinc/Gray/White/Black). Color is applied only where data requires it: Emerald (Income) and Rose (Expenses) in the Area Chart.
* **Modern Neumorphism:** Subtle extruded surface shadows on cards, smooth inset shadows on active tabs/pressed inputs, and soft tactile corners.
* **Seamless Shell Structure:** Borderless pure white top bar with center navigation, resting above a white main content container featuring smooth rounded top-left and top-right corners.

---

## 2. Global Shell & Navigation Architecture

```
+----------------------------------------------------------------------------------------------------------+
|  [LOGO] Finly                   [ Dashboard ]   [ History ]   [ Invoices ]            (🌙)  (🔔)  [AZ v] |
+----------------------------------------------------------------------------------------------------------+
|  <--- TOP BAR: PURE WHITE, ZERO BORDER (bg-white dark:bg-zinc-950 border-none) ------------------------>  |
|                                                                                                          |
|  +-- MAIN CONTENT CONTAINER: WHITE WITH ROUNDED TOP CORNERS (rounded-t-[32px] bg-white) --------------+  |
|  |                                                                                                    |  |
|  |  Content, Neumorphic Cards, Interactive Chart, Transactions Ledger, Invoices...                   |  |
|  |                                                                                                    |  |
|  +----------------------------------------------------------------------------------------------------+  |
```

### 2.1 Navigation Layout Structure
1. **Top Bar Header (`<header>`):**
   * **Background & Border:** Pure white background (`bg-white dark:bg-zinc-950`), zero border (`border-none`), zero outline, no bottom divider.
   * **Left (Brand Identity):**
     * 8-pointed geometric spark logo in neutral black/white (`fill-foreground`).
     * Brand text **Finly** in bold Geist Mono (`font-mono font-bold tracking-tight text-foreground text-lg`).
   * **Center (Core Navigation - Desktop):**
     * Centered pill container with soft neumorphic inset styling:
       * **Dashboard** (`/`)
       * **History** (`/history`)
       * **Invoices** (`/invoices`)
     * Active state: High-contrast neutral pill (`bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-neu-sm`).
   * **Right (Utility Controls):**
     * **Theme Switcher:** Single-click toggle between Light and Dark modes.
     * **Notification Popover (`popover`):** Actionable alerts on pending invoices and runway thresholds.
     * **User Profile Dropdown (`avatar` + `dropdown-menu`):**
       * User avatar with initials (`[AZ]`).
       * Menu items: Privacy Masking Toggle (`$ ••••`), Settings (`/settings`), Export Data (CSV), and Sign Out. (Persona switching is completely removed).

2. **Main Content Container (`<main>`):**
   * Features a pure white surface (`bg-white dark:bg-zinc-900`).
   * **Rounded Top Geometry:** `rounded-t-[32px] sm:rounded-t-[40px]`.
   * Encloses all dashboard views, metric cards, interactive charts, and data tables.

3. **Mobile Navigation Adaptation (`< 768px`):**
   * Top bar displays Brand Logo (left) and Utilities + Profile Avatar (right).
   * Bottom bar provides thumb navigation:
     1. **Dashboard**
     2. **History**
     3. **(+) Quick Add Action**
     4. **Invoices**
     5. **Settings**

---

## 3. Main Dashboard Detailed Specification (`/`)

```
+----------------------------------------------------------------------------------------------------------+
|  (*) FINLY                      [ Dashboard ]   [ History ]   [ Invoices ]            (🌙)  (🔔)  [AZ v] |
+----------------------------------------------------------------------------------------------------------+
   ╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
   │  MAIN CONTENT CONTAINER (bg-white dark:bg-zinc-900 rounded-t-[32px])                               │
   │                                                                                                    │
   │  OCTOBER 2026 CASHFLOW                                                [+ Record Transaction]       │
   │  Summary of net cash, daily spending limit, and trends.                                            │
   │                                                                                                    │
   │  +-- NEUMORPHIC CARD 1 -----+  +-- NEUMORPHIC CARD 2 -----+  +-- NEUMORPHIC CARD 3 --------------+ │
   │  | TOTAL BALANCE            |  | TOTAL INCOME (MONTH)     |  | TOTAL EXPENSES (MONTH)            | │
   │  | $4,250.00                |  | $8,500.00                |  | $4,250.00                         | │
   │  | Net available cash       |  | Total cash received      |  | Total cash disbursed              | │
   │  +--------------------------+  +--------------------------+  +-----------------------------------+ │
   │                                                                                                    │
   │  +-- SAFE-TO-SPEND HERO (EXTRUDED NEUMORPHIC SURFACE) -------------------------------------------+ │
   │  | SAFE-TO-SPEND: $45.00 / day                                                   [👁 Hide Balance]| │
   │  | Based on $4,250.00 cash on hand with 21 days remaining in this cycle.                         | │
   │  +-----------------------------------------------------------------------------------------------+ │
   │                                                                                                    │
   │  CASHFLOW OVERVIEW (AREA CHART)                              Filter: [ 1W ] [ 1M ] [ 3M ] [ 6M ] [ 1Y]│
   │  +-----------------------------------------------------------------------------------------------+ │
   │  |  $10k |  .:'""`:.                                                                             | │
   │  |   $8k | :         `:.       [Tooltip Popover - Oct 14]                                        | │
   │  |   $6k | :   Income  `:.     ┌────────────────────────────┐                                    | │
   │  |   $4k | :   (Emerald):.    │ Date: Oct 14, 2026         │                                    | │
   │  |   $2k | :             `:.   │ Income:     $2,000.00      │                                    | │
   │  |    $0 +-:...............:...│ Expenses:     $180.00      │──────────────────────────────────> │ │
   │  |        Oct 01    Oct 08     └────────────────────────────┘  Oct 22     Oct 29     Oct 31      | │
   │  +-----------------------------------------------------------------------------------------------+ │
   │                                                                                                    │
   │  RECENT TRANSACTIONS                              Filters: [ All (14) ]  [ Income (2) ]  [ Expenses (12) ]│
   │  ------------------------------------------------------------------------------------------------- │
   │  TRANSACTION / NOTE             CATEGORY               DATE          WALLET              AMOUNT    │
   │  ------------------------------------------------------------------------------------------------- │
   │  Specialty Coffee Roasters      Food & Personal        Today         Checking Account    -$4.50    │
   │  UI Design Retainer             Client Invoices        Yesterday     Main Business    +$2,000.00   │
   │  Cloud Server Hosting           Software & Tools       Oct 28        Checking Account   -$25.00    │
   │  Coworking Hot Desk             Workspace              Oct 25        Main Business     -$180.00    │
   │  Weekly Organic Groceries       Groceries              Oct 24        Checking Account   -$64.20    │
   │  Figma Subscription             Software & Tools       Oct 22        Main Business      -$15.00    │
   │  Gas Station Fill-up            Commute & Fuel         Oct 21        Checking Account   -$42.00    │
   │  Brand Sprint Payment           Client Invoices        Oct 18        Main Business    +$1,200.00   │
   │  Client Strategy Lunch          Dining & Personal      Oct 17        Checking Account   -$58.00    │
   │  Internet Fiber Line            Utilities              Oct 15        Checking Account   -$50.00    │
   │  ------------------------------------------------------------------------------------------------- │
   │  Showing 1 - 10 of 14 transactions                              [< Previous]  Page 1 of 2  [Next >]│
   ╰────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

### 3.1 Neumorphic Metric Cards
1. **Total Balance Card:**
   * Styled with a soft raised surface (`shadow-neu-raised rounded-2xl p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800`).
   * Large numeric display in Geist Mono: `$4,250.00`.
   * Label: `TOTAL BALANCE` in neutral muted gray.
2. **Total Income Card:**
   * Styled with soft neumorphic elevation.
   * Total cash in for the active period: `$8,500.00` in neutral dark/white.
3. **Total Expenses Card:**
   * Styled with soft neumorphic elevation.
   * Total cash out for the active period: `$4,250.00` in neutral dark/white.

### 3.2 Safe-to-Spend Hero Surface
* Calculated headroom: `(Total Balance - Fixed Commitments) / Days Remaining`.
* Neumorphic extruded container featuring Geist Mono figures: `$45.00 / day`.
* Integrated **[👁 Hide Balance]** privacy toggle to blur numbers in public settings (`$ ••••`).

### 3.3 Interactive Area Chart (Only Component with Color)
* **Visual Styling:**
  * Uses shadcn/ui **Area Chart - Interactive** primitives with linear gradients.
  * **Income Fill:** Gradient using Emerald (`#10B981`) fading from opacity `0.4` to `0.05`.
  * **Expenses Fill:** Gradient using Rose (`#F43F5E`) fading from opacity `0.4` to `0.05`.
  * All axes, labels, grids, and legend text are rendered in neutral monochrome Geist Mono.
* **Interactive Date Filters:**
  * Segmented controls for `1W`, `1M`, `3M`, `6M`, and `1Y`.
  * Neumorphic inset styling on the active tab (`shadow-neu-inset bg-zinc-100 dark:bg-zinc-800`).
* **Point-Level Tooltips:**
  * Elevated popover showing exact Date, Income, Expenses, and Net Difference in mono-spaced tabular format.

### 3.4 Recent Transactions Table with Filters & Pagination
* **Filter Pills:** Segmented tabs for `All`, `Income`, and `Expenses` with neutral active states.
* **Pagination Constraints:**
  * Strictly **10 items per page**.
  * Previous / Next navigation controls in Geist Mono that disable automatically at page boundaries.
* **Table Styling:** Minimalist, borderless rows with soft hover states (`hover:bg-zinc-50 dark:hover:bg-zinc-800/50`).

---

## 4. Invoices & Receivables Module (`/invoices`)

A clean, built-in invoicing system available to all users without requiring persona setup:

```
+----------------------------------------------------------------------------------------------------------+
|  INVOICES & RECEIVABLES                                                          [+ Create New Invoice]  |
|                                                                                                          |
|  +-- WAITING TO BE PAID --------+  +-- OVERDUE ------------------+  +-- PAID THIS MONTH ----------------+  |
|  | $3,450.00                    |  | $450.00                     |  | $2,100.00                         |  |
|  | 3 Invoices Pending           |  | 1 Invoice Overdue           |  | 2 Invoices Collected              |  |
|  +------------------------------+  +-----------------------------+  +-----------------------------------+  |
|                                                                                                          |
|  [ All (6) ]   [ Unpaid (3) ]   [ Overdue (1) ]   [ Paid (2) ]   [ Drafts (0) ]                          |
|                                                                                                          |
|  CLIENT / PROJECT         INVOICE #     DUE DATE        AMOUNT       STATUS        ACTIONS               |
|  ------------------------------------------------------------------------------------------------------- |
|  Acme Design Studio       INV-004       In 3 days       $1,500.00    [SENT]        [Mark Paid]  [Share]  |
|  Budi Bakery Shop         INV-003       2 days ago      $450.00      [OVERDUE]     [Reminder]   [Share]  |
|  Global Media Corp        INV-002       Nov 20, 2026    $1,500.00    [SENT]        [Mark Paid]  [Share]  |
|  Startup Lab Inc          INV-001       Oct 15, 2026    $2,100.00    [PAID]        [View PDF]   [...]    |
+----------------------------------------------------------------------------------------------------------+
```

### 4.1 "Mark as Paid" Cashflow Settlement Flow
When the user clicks **[Mark Paid]**:
1. A native shadcn/ui `Dialog` opens.
2. The user confirms depositing the invoice amount into their cashflow.
3. On confirmation:
   * Invoice status switches to **[PAID]**.
   * An automated **Income** transaction is added to the ledger.
   * Total Balance and Safe-to-Spend limits update immediately.

---

## 5. Modal Dialogs Architecture (Native shadcn/ui Dialog)

All creation and confirmation flows use the native shadcn/ui `Dialog` component styled with minimalist neumorphic borders and soft drop shadows:

### 5.1 Create Record / Transaction Dialog
```
+-------------------------------------------------------------------+
|  Record Transaction                                           [X] |
+-------------------------------------------------------------------+
|  Log money moving into or out of your cashflow.                   |
|                                                                   |
|  TYPE:                                                            |
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
|  [ e.g., Lunch with client                                      ] |
|                                                                   |
|  ---------------------------------------------------------------- |
|  [ Cancel ]                                  [ Save Transaction ] |
+-------------------------------------------------------------------+
```

---

## 6. Client-Side Data Schema (TypeScript)

Unified, clean schema with persona models removed:

```typescript
// --- 1. User & Settings Model ---
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  currency: 'USD'; // Enforced USD globally
  privacyBlurEnabled: boolean;
  themePreference: 'system' | 'light' | 'dark';
  paymentDetails: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    notes?: string;
  };
}

// --- 2. Cashflow Transaction Model ---
export type TransactionType = 'money_in' | 'money_out';

export interface Transaction {
  id: string;
  date: string; // ISO YYYY-MM-DD
  amount: number; // Stored as positive USD float (e.g., 45.00)
  type: TransactionType;
  category: string;
  walletId: string;
  note?: string;
  invoiceReferenceId?: string; // Links to settled invoice if applicable
  createdAt: number;
}

// --- 3. Invoices Model ---
export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // USD
  total: number; // USD
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-004"
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  taxRatePercent: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentInstructions?: string;
  paidAtDate?: string;
  cashflowTransactionId?: string;
}

// --- 4. Interactive Area Chart & Pagination Types ---
export type ChartTimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

export interface AreaChartDataPoint {
  date: string; // "YYYY-MM-DD"
  income: number;
  expenses: number;
  net: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number; // Fixed at 10
  totalPages: number;
}
```

---

## 7. Frontend Acceptance Criteria (Definition of Done)

* [ ] **Geist Mono Enforced:** All headers, body copy, navigation items, buttons, modal inputs, and numeric figures render strictly in Geist Mono.
* [ ] **Persona Switcher Removed:** No persona selector exists in onboarding, header, profile dropdown, or settings. The workspace is unified for all users.
* [ ] **Monochrome Neutral Palette:** All buttons, cards, navigation pills, and logos use neutral tones (white, zinc, black). Only the Area Chart uses color (Emerald for Income, Rose for Expenses).
* [ ] **Top Bar Styling:** The top bar has a pure white background (`bg-white dark:bg-zinc-950`) with no border, divider, or outline.
* [ ] **Main Content Geometry:** The main content container has a white background (`bg-white dark:bg-zinc-900`) and rounded top-left and top-right corners (`rounded-t-[32px] sm:rounded-t-[40px]`).
* [ ] **Neumorphic Architecture:** Cards feature soft extruded elevation shadows, and active controls/inputs use subtle inset shadows.
* [ ] **Area Chart:** Dual-gradient Area Chart with `1W`, `1M`, `3M`, `6M`, `1Y` filters and point-level popover tooltips.
* [ ] **10-Row Transactions Table:** Recent transactions feed strictly paginates at 10 rows per page with working Previous/Next controls and category filters (`All`, `Income`, `Expenses`).
* [ ] **Native shadcn/ui Dialogs:** Transaction creation, invoice creation, and payment settlement flows render cleanly inside shadcn/ui `Dialog` modals.