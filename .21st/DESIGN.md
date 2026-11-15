# Finly — Design System & Style Guide (DESIGN.md)

**Project:** `finly-web` (v3.0.0)  
**Stack Architecture:** React 19, TanStack Start, TanStack Router, shadcn/ui (Radix UI & Base UI), Tailwind CSS v4  
**Design Aesthetic:** Rounded Brutalism + Glassmorphism Bento Grid (2px Solid Borders, Static Offset Shadows, Translucent Surfaces, Radial Ambient Blur)  
**Primary Typography:** Geist Mono Variable (`@fontsource-variable/geist-mono`) across all elements and tabular financial figures  
**Grid Architecture:** 12-Column CSS Grid Bento Matrix with **16px (`gap-4`)** desktop gutter rhythm  
**Color Palette:** High-Contrast Neon-Minimalist (`Primary=#C9F31D`, `Tertiary=#6366F1`, Dark Root `#111111`, Light Root `#FFFFFF`)  
**Balance Privacy:** Inline eye toggle button (`Eye` / `EyeOff`) situated directly to the right of the Total Balance figure in `TotalBalanceBentoTile` (absent from `SafeToSpendHero`)

---

## 1. Bento Grid Architecture & Spatial Guidelines

Finly organizes financial metrics into modular, single-responsibility compartments inside an asymmetrical 12-column grid with clear visual hierarchy:

### 1.1 Grid Metrics & Spacing Tokens

- **Tile Gutter Rhythm:** `16px` (`gap-4`) across dashboard and invoice Bento grids.
- **Container Width:** `max-w-7xl mx-auto p-4 sm:p-6 lg:p-8` (with `mb-20 sm:mb-0` clearance for the fixed mobile dock).
- **Corner Radii:**
  - Macro Bento Tiles (`.bento-card`) & Modals: `rounded-3xl` (`--radius-bento: 1.5rem` / `24px`).
  - Inner cards, filter containers, and action buttons: `rounded-xl` (`12px`) or `rounded-2xl` (`16px`).
  - Pill badges & progress tracks: `rounded-lg` (`8px`) or `rounded-full`.

### 1.2 Surface & Geometry Rules (`src/styles.css`)

- **Sticky Glass Header (`.glass-header`):**
  - `position: sticky; top: 0; z-index: 40; width: 100%;` (borderless, no `border-bottom`).
  - `background-color: var(--glass-header);` paired with `@apply backdrop-blur-md;`.
  - Mobile bottom dock (`md:hidden`) reuses `.glass-header` at `fixed inset-x-0 bottom-0 h-18 border-t-2 border-border`.
- **Rounded Brutalism Bento Cards (`.bento-card`):**
  - `border-radius: var(--radius-bento);` `border: 2px solid var(--border);` `box-shadow: 4px 4px 0px 0px var(--border);` `@apply backdrop-blur-xs;`.
  - Does **not** hardcode `background-color: var(--card)` inside `.bento-card` so individual tiles cleanly control their background utility (`bg-primary`, `bg-card`, `bg-outflow-bg`).
  - **Macro, Static, Grounded:** Bento card containers never lift, glow, or change border color on hover.
- **Brutal Surfaces & Interactive Buttons (`.brutal-surface`, `.brutal-btn`):**
  - `.brutal-surface`: `2px solid var(--border)`, `box-shadow: 2px 2px 0px 0px var(--border)`, `@apply backdrop-blur-lg`.
  - `.brutal-btn`: `2px` border + `2px 2px` shadow with subtle `-1px/-1px` hover lift and `1px/1px` press depression (`prefers-reduced-motion: no-preference`).

### 1.3 Dashboard Bento Tile Typologies

1. **Primary Spotlight Tile (`TotalBalanceBentoTile` — Electric Lime `#C9F31D`):**
   - `bg-primary text-primary-foreground` anchor card (`col-span-12 md:col-span-4`). Hosts net balance, inline `Eye` / `EyeOff` toggle, high-contrast wallet filter chips, and safety buffer footer.
2. **Safe-to-Spend Tile (`SafeToSpendHero` — Glass Card `bg-card`):**
   - `col-span-12 md:col-span-4`. Hosts daily spending limit, cycle days-left badge, `bg-background` progress block with Primary Lime (`bg-primary`) fill bar, and monthly discretionary pool.
3. **Monthly Summary Tile (`CashSummaryBentoTile` — Glass Card `bg-card`):**
   - `col-span-12 md:col-span-4`. Displays net flow in neutral `text-foreground`, `Positive` / `Over Spent` status badge, and side-by-side `bg-background` Inflow/Outflow summary boxes.
4. **Analytics Chart Tile (`CashflowTrendChart` — Glass Card `bg-card`):**
   - `col-span-12 lg:col-span-8`. Hosts the Recharts `AreaChart` and `bg-background` time-range selector (`1W`, `1M`, `3M`, `6M`, `1Y`).
5. **Receivables Tile (`ReceivablesBentoTile` — Glass Card `bg-card`):**
   - `col-span-12 lg:col-span-4`. Hosts pending invoice totals, Overdue / Paid breakdowns, and a full-width Indigo-accented `Manage Invoices ↗` link button.
6. **Ledger Tile (`RecentTransactionsCard` — Glass Card `bg-card`):**
   - `col-span-12`. Hosts the 10-row paginated activity table with category-matched Lucide icons (`getCategoryIcon`) and inflow/outflow filters.

---

## 2. Color System & Token Specification (`src/styles.css`)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           FINLY v3.0.0 COLOR TOKENS                          │
├──────────────────┬─────────────────────────────┬─────────────────────────────┤
│ TOKEN            │ LIGHT MODE (:root)          │ DARK MODE (.dark)           │
├──────────────────┼─────────────────────────────┼─────────────────────────────┤
│ --background     │ #ffffff                     │ #111111                     │
│ --foreground     │ #111111                     │ #ffffff                     │
│ --glass-header   │ rgba(255, 255, 255, 0.25)   │ rgba(17, 17, 17, 0.65)      │
│ --card           │ rgba(255, 255, 255, 0.65)   │ rgba(30, 30, 36, 0.55)      │
│ --popover        │ rgba(255, 255, 255, 0.85)   │ rgba(24, 24, 28, 0.82)      │
│ --primary        │ #c9f31d (text: #111111)     │ #c9f31d (text: #111111)     │
│ --primary-hover  │ #b8e016                     │ #b8e016                     │
│ --tertiary       │ #6366f1 (hover: #818cf8)    │ #6366f1 (hover: #818cf8)    │
│ --secondary      │ #e4e4e7                     │ #1e1e21                     │
│ --muted          │ #e4e4e7                     │ #18181b                     │
│ --muted-fg       │ #52525b                     │ #a1a1aa                     │
│ --border / input │ #e4e4e7 / #d4d4d8           │ #3f3f46 / #3f3f46           │
│ --ring           │ #6366f1                     │ #6366f1                     │
├──────────────────┴─────────────────────────────┴─────────────────────────────┤
│ SEMANTIC FINANCIAL INDICATORS                                                │
├──────────────────┬─────────────────────────────┬─────────────────────────────┤
│ --inflow         │ #34d399 (bg 0.14 / bdr 0.35)│ #34d399 (bg 0.14 / bdr 0.32)│
│ --outflow        │ #fb7185 (bg 0.14 / bdr 0.35)│ #fb7185 (bg 0.14 / bdr 0.32)│
│ --warning        │ #fbbf24                     │ #fbbf24                     │
│ --info           │ #38bdf8                     │ #38bdf8                     │
└──────────────────┴─────────────────────────────┴─────────────────────────────┘
```

### 2.1 Radial Ambient Gradient Blur (`.ambient-gradient-blur`)

Fixed behind the main canvas (`h-[75vh] w-[140%] -top-10 left-1/2 -translate-x-1/2`), using purely **radial gradients** (no linear gradients) for smooth optical diffusion:

- **Light Mode:**
  - `radial-gradient(circle 650px at 20% 0%, rgba(201, 243, 29, 0.36), transparent 70%)`
  - `radial-gradient(circle 650px at 80% 0%, rgba(99, 102, 241, 0.40), transparent 70%)`
  - `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(201, 243, 29, 0.18) 0%, rgba(99, 102, 241, 0.20) 45%, transparent 75%)`
  - `filter: blur(60px)`
- **Dark Mode (`.dark .ambient-gradient-blur`):**
  - Same radial geometry tuned to `0.20` Lime, `0.26` Indigo, and `0.12 -> 0.16` center ellipse with `filter: blur(65px)`.

### 2.2 Tertiary Indigo (`#6366F1`) Application Rules & Constraints

1. **Invoices & Receivables:** Status badges (`Sent`, `Draft`) and invoice tags (`#INV-xxx`) use `border-[#6366F1]/30 bg-[#6366F1]/15 text-[#6366F1]`; utility links/buttons (`Copy Link`, `Share Link`, `Manage Invoices ↗`) use `hover:border-[#6366F1] hover:bg-[#6366F1]/25 hover:text-[#818CF8]`.
2. **Inter-Account Transfers:** Categorized via `isTransferCategory` and highlighted with `#6366F1` badges and `ArrowLeftRight` icons across Recent Activity, History, Search, and Quick Entry.
3. **Focus States:** Text inputs, selects, and textareas use `--ring: #6366F1` (`focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:border-[#6366F1]`).
4. **Strict Negative Constraints:**
   - **NEVER** add hover/shadow lift interactions to `.bento-card` containers.
   - **NEVER** change the hover color of Primary Lime (`#C9F31D`) CTA buttons to Indigo.
   - **NEVER** use Tertiary Indigo for primary balance figures or operational cashflow metrics.

---

## 3. Brand Identity & Iconography

### 3.1 Brand Logo (`src/components/brand-logo.tsx`)

The official 1000 × 1000 8-pointed star spark SVG (`BrandLogo`) accepts `size` (default `32`) and `className` (e.g., `fill-black` inside the Electric Lime `brutal-surface` badge in `AppShell`, `InvoicePreviewDialog`, `LoginScreen`, and `SignupScreen`).

### 3.2 Iconography & Interaction Safeguards

- **Category Icons (`RecentTransactionsCard`):** `getCategoryIcon(category, type)` maps categories to semantic Lucide icons (`Utensils`, `ShoppingCart`, `Laptop`, `Building2`, `Car`, `Zap`, `Wrench`, `ReceiptText`, `FileText`, `Briefcase`, `TrendingUp`, `Coins`, `ArrowLeftRight`, and `ArrowUpRight`/`ArrowDownRight` fallbacks).
- **Theme Switcher Icons (`AppShell`):** `Sun` uses `dark:hidden` and `Moon` uses `hidden dark:block` instead of CSS `scale-0` hiding, ensuring button hover `scale(1.12)` rules never reveal or overlap the inactive icon.
- **Non-Modal Profile Menu:** `<DropdownMenu modal={false}>` (and default `modal = false` in `src/components/ui/dropdown-menu.tsx`) prevents body scroll locking and scrollbar-width shifts on the sticky topbar.
- **Material Symbols Rounded:** Bundled via `@fontsource-variable/material-symbols-rounded` with `.material-symbols-rounded` and `.material-symbols-rounded.fill` helpers in `src/styles.css`.

---

## 4. Typography: Geist Mono Standard

All UI elements, headings, labels, badges, and numeric values use **Geist Mono Variable**:

```css
@theme inline {
  --font-sans: "Geist Mono Variable", "Geist Mono", monospace;
  --font-mono: "Geist Mono Variable", "Geist Mono", monospace;
}
```

### 4.1 Typography Scale

- **Page Heading:** `font-mono text-2xl font-black uppercase tracking-tight sm:text-3xl`
- **Primary Bento Stat:** `font-mono text-3xl font-black tracking-tight tabular-nums sm:text-4xl`
- **Tile Eyebrow / Label:** `font-mono text-xs font-extrabold uppercase tracking-wider`
- **Microcopy & Subtitles:** `font-mono text-xs text-muted-foreground`
- **Table & Financial Figures:** `font-mono text-xs tabular-nums` with `.privacy-masked` (`filter: blur(10px)`) when privacy masking is active.

---

## 5. Dialogs & Print Media Rules

- **Modals:** Styled with `brutal-surface rounded-3xl border-2 border-border bg-popover/80 p-6`, `showCloseButton={false}`, and an explicit inline `<DialogClose asChild>` `icon-xs` `<X />` button.
- **Print / PDF Output (`@media print`):** `.no-print { display: none !important; }` hides navigation chrome (`AppShell` header and mobile dock) as well as the `InvoicePreviewDialog` header row, `<DialogClose>` button, and bottom action bar so printed/PDF invoices contain only the clean invoice sheet.
