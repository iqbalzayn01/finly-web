# Finly — Design System & Style Guide (DESIGN.md)

**Project:** `finly-web`  
**Stack Architecture:** React 19, Vite, shadcn/ui, Tailwind CSS v4  
**Design Aesthetic:** Modern Editorial Bento Grid (High-Contrast, Asymmetric Tiles, Micro-Badges, Tactile Geometry)  
**Primary Typography:** Geist Mono (`@fontsource-variable/geist-mono`) across all elements and tabular financial figures  
**Grid Architecture:** CSS Grid Bento Matrix with strict **8px (`gap-2`)** or **16px (`gap-4`)** gutter rhythm  
**Color Palette:** High-Contrast Neon-Minimalist (Primary Lime `#C9F31D`, Background `#111111`, Accent Violet `#A78BFA`, Secondary Zincs `#27272A`/`#F4F4F5`)  
**Balance Privacy:** Inline eye toggle button (`Eye` / `EyeOff`) situated directly to the right of the Total Balance numeric string

---

## 1. Bento Grid Architecture & Spatial Guidelines

Inspired by modern high-end editorial and financial bento layouts (as seen in contemporary fintech, Kestrel, and creative studios), the UI organizes complex data into distinct, asymmetric content tiles with purposeful hierarchy:

### 1.1 Grid Metrics & Spacing Tokens

- **Tile Gutter Rhythm:**
  - **Compact Gutter:** `8px` (`gap-2`) on mobile viewports or dense table cards.
  - **Default Gutter:** `16px` (`gap-4`) on desktop viewports and primary dashboard grids.
- **Bento Tile Corner Radii:**
  - Tiles: `rounded-2xl` (`16px`) or `rounded-3xl` (`24px`).
  - Inner elements (badges, micro-chips, action pills): `rounded-xl` (`12px`) or `rounded-full`.
- **Container Shell Geometry:**
  - Top Bar: Borderless pure white (`bg-white dark:bg-zinc-950`).
  - Main Content Canvas: Pure white (`bg-white dark:bg-[#111111]`) with `rounded-t-[32px] sm:rounded-t-[40px]`.

### 1.2 Bento Tile Typologies

1. **Hero Spotlight Tile (Primary Lime `#C9F31D`):**
   - High-contrast anchor tile with `#111111` typography. Used for key active alerts or top-level financial summaries.
2. **Data & Analytics Tile (Canvas Zinc `#27272A` / `#F4F4F5`):**
   - Hosts the interactive area chart, category breakdown bars, or data feeds.
3. **Metric Punch Tiles (High-Contrast White / Black / Accent):**
   - Features oversized Geist Mono numbers, subtle micro-corner badges (e.g., `↗`, status pills, category icons), and bottom-aligned context notes.
4. **Ledger Tile (Span-12 Full Width):**
   - Hosts the paginated 10-row transactions table with clean column dividers and hover states.

---

## 2. Color System & Token Specification

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FINLY COLOR PALETTE                             │
├──────────────┬──────────────┬──────────────────────────────┬───────────┤
│ TOKEN        │ HEX / VALUE  │ INTENDED ROLE                │ TEXT COLOR│
├──────────────┼──────────────┼──────────────────────────────┼───────────┤
│ Primary      │ #C9F31D      │ Brand Lime, Hero Bento Tiles │ #111111   │
│ On-Primary   │ #111111      │ Text/Icons on Lime Surface   │ N/A       │
│ Background   │ #111111      │ Canvas Root / App Background │ #FFFFFF   │
│ Foreground   │ #FFFFFF      │ Primary White Text (Dark)    │ N/A       │
│ Secondary Dk │ #27272A      │ Zinc-800 Card Tile / Chips   │ #FFFFFF   │
│ Secondary Lt │ #F4F4F5      │ Zinc-100 Light Surface       │ #111111   │
│ Accent       │ #A78BFA      │ Violet 400 (Contrast to Lime)│ #111111   │
│ Muted Text   │ #A1A1AA      │ Zinc-400 Descriptions/Labels │ N/A       │
├──────────────┴──────────────┴──────────────────────────────┴───────────┤
│ FUNCTIONAL / SEMANTIC ACCENTS                                          │
├──────────────┬──────────────┬──────────────────────────────┬───────────┤
│ Income       │ #34D399      │ Emerald 400 (Income Card)    │ #111111   │
│ Expense      │ #FB7185      │ Rose 400 (Expenses Card)     │ #111111   │
│ Warning      │ #FBBF24      │ Amber 400 (Limit / Overdue)  │ #111111   │
│ Info         │ #38BDF8      │ Sky 400 (Tooltips & Notes)   │ #111111   │
└──────────────┴──────────────┴──────────────────────────────┴───────────┘
```

---

## 3. Brand Identity & Logo Specification

### 3.1 Official Master SVG Asset (1000 × 1000)

Rendered in `currentColor` or brand Primary Lime (`#C9F31D`):

```xml
<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#finly_bento_logo_clip)">
<path d="M479.046 321.452C471.944 260.588 464.484 196.659 463.089 124.002C462.835 110.75 473.603 100 486.858 100H513.142C526.397 100 537.165 110.75 536.907 124.003C535.507 195.861 528.089 259.647 521.004 320.508C517.042 354.558 513.186 387.694 510.551 420.816C508.817 442.62 534.337 453.189 548.522 436.54C569.878 411.474 590.364 385.573 611.44 358.926C649.451 310.869 689.384 260.389 739.771 208.029C748.962 198.478 764.178 198.491 773.551 207.864L792.137 226.45C801.51 235.823 801.523 251.039 791.969 260.227C740.165 310.048 689.812 349.903 641.768 387.932L641.718 387.97C614.86 409.232 588.723 429.922 563.457 451.465C546.813 465.657 557.385 491.178 579.189 489.435C612.008 486.812 644.805 482.985 678.544 479.048C739.408 471.944 803.341 464.484 875.998 463.089C889.25 462.835 900 473.603 900 486.858V513.142C900 526.397 889.25 537.165 875.997 536.907C804.141 535.506 740.356 528.085 679.498 521.004L679.448 521C645.414 517.04 612.296 513.187 579.192 510.554C557.387 508.819 546.817 534.341 563.468 548.526C588.507 569.857 614.381 590.323 640.998 611.374L641.066 611.432C689.126 649.447 739.609 689.378 791.973 739.771C801.523 748.963 801.51 764.178 792.138 773.55L773.55 792.138C764.178 801.51 748.962 801.523 739.774 791.97C689.952 740.168 650.099 689.818 612.076 641.778L611.976 641.64L611.892 641.53C590.675 614.737 570.027 588.662 548.532 563.454C534.34 546.81 508.817 557.382 510.552 579.185C513.186 612.307 517.042 645.442 521.004 679.492C528.089 740.354 535.507 804.138 536.907 875.997C537.165 889.25 526.397 900 513.142 900H486.858C473.603 900 462.835 889.25 463.089 875.998C464.484 803.342 471.944 739.412 479.046 678.548L479.062 678.438C482.993 644.737 486.814 611.976 489.434 579.193C491.177 557.389 465.655 546.816 451.463 563.46C429.969 588.666 409.323 614.739 388.108 641.53L388.024 641.64L387.924 641.778C349.901 689.818 310.048 740.168 260.227 791.97C251.039 801.523 235.823 801.51 226.45 792.138L207.863 773.55C198.491 764.178 198.477 748.963 208.028 739.772C260.391 689.378 310.874 649.447 358.934 611.432L359.002 611.374C385.618 590.323 411.492 569.858 436.53 548.527C453.181 534.342 442.611 508.82 420.806 510.554C387.686 513.189 354.552 517.043 320.502 521.004C259.644 528.085 195.859 535.506 124.003 536.907C110.75 537.165 100 526.397 100 513.142V486.858C100 473.603 110.75 462.835 124.002 463.089C196.66 464.484 260.593 471.944 321.456 479.048C355.195 482.985 387.991 486.812 420.809 489.435C442.613 491.178 453.186 465.656 436.541 451.465C411.26 429.909 385.107 409.207 358.232 387.932C310.188 349.903 259.834 310.048 208.031 260.227C198.478 251.039 198.491 235.823 207.863 226.45L226.45 207.864C235.823 198.491 251.038 198.478 260.229 208.029C310.616 260.389 350.549 310.869 388.56 358.926C409.635 385.57 430.119 411.469 451.473 436.532C465.658 453.182 491.177 442.61 489.434 420.807C486.814 388.024 482.993 355.263 479.062 321.562L479.046 321.452Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="finly_bento_logo_clip">
<rect width="1000" height="1000" fill="white"/>
</clipPath>
</defs>
</svg>
```

---

## 4. Typography: Geist Mono Standard

All typographic elements, numbers, micro-badges, and labels utilize **Geist Mono** (`@fontsource-variable/geist-mono`):

```css
@theme {
  --font-mono: 'Geist Mono', monospace;
  --font-sans: 'Geist Mono', monospace;
}
```

### 4.1 Typography Scale in Bento Cards

- **Oversized Bento Stat:** `font-mono text-3xl sm:text-5xl font-black tracking-tighter tabular-nums`
- **Card Header / Pill:** `font-mono text-[11px] uppercase tracking-widest font-semibold`
- **Microcopy & Subtitle:** `font-mono text-xs text-[#A1A1AA] tracking-normal`
- **Table Data Cells:** `font-mono text-xs tabular-nums`

---

## 5. Tailwind CSS v4 Theme Configuration (`src/index.css`)

```css
@import 'tailwindcss';

@layer base {
  :root {
    /* Canvas & Surfaces */
    --background: #111111;
    --foreground: #ffffff;

    /* Bento Base Colors */
    --primary: #c9f31d;
    --primary-foreground: #111111;

    --secondary: #27272a;
    --secondary-foreground: #ffffff;
    --secondary-light: #f4f4f5;

    --accent: #a78bfa;
    --accent-foreground: #111111;

    --muted: #27272a;
    --muted-foreground: #a1a1aa;

    /* Semantic Financial Indicators */
    --semantic-income: #34d399;
    --semantic-expense: #fb7185;
    --semantic-warning: #fbbf24;
    --semantic-info: #38bdf8;

    --border: #27272a;
    --radius-bento: 1.5rem; /* 24px */
  }

  body {
    font-family: var(--font-mono);
    background-color: var(--background);
    color: var(--foreground);
    letter-spacing: -0.01em;
  }
}

/* Custom Bento Utility Helpers */
@utility bento-card {
  border-radius: var(--radius-bento);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.2s ease;
}

@utility bento-card:hover {
  transform: translateY(-2px);
}
```

---

## 6. Bento Component Implementation Samples

### 6.1 Total Balance Bento Card with Inline Eye Toggle

Located inside the primary Bento matrix. Features the eye icon toggle directly next to the numeric balance string:

```tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function BalanceBentoCard({ amount = 4250.0 }: { amount: number }) {
  const [isMasked, setIsMasked] = useState(false);

  return (
    <div className="bento-card bg-[#27272A] p-6 flex flex-col justify-between border border-zinc-800">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#A1A1AA]">
          Total Balance
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#C9F31D]" />
      </div>

      <div className="my-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white tabular-nums">
            {isMasked
              ? '$ ••••••'
              : `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </span>
          <button
            onClick={() => setIsMasked(!isMasked)}
            aria-label={isMasked ? 'Show balance' : 'Hide balance'}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            {isMasked ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="font-mono text-xs text-[#A1A1AA] mt-1">
          Available across 2 accounts
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
        <span className="font-mono text-[11px] text-[#A1A1AA]">
          Auto-updated
        </span>
        <span className="font-mono text-xs text-[#C9F31D] font-bold">Live</span>
      </div>
    </div>
  );
}
```

### 6.2 Safe-to-Spend Bento Tile (Clean — No Hide Button)

Pure financial calculation tile, devoid of privacy controls:

```tsx
export function SafeToSpendBentoTile({
  dailyAmount = 45.0,
  daysRemaining = 21,
}) {
  return (
    <div className="bento-card bg-[#C9F31D] p-6 text-[#111111] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]/70">
          Daily Safe-to-Spend
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#C9F31D] text-[10px] font-bold">
          {daysRemaining}D LEFT
        </span>
      </div>

      <div className="my-4">
        <div className="font-mono text-4xl sm:text-5xl font-black tracking-tighter tabular-nums">
          ${dailyAmount.toFixed(2)}
          <span className="text-sm font-semibold ml-1 text-[#111111]/70">
            /day
          </span>
        </div>
        <p className="font-mono text-xs font-medium text-[#111111]/80 mt-1">
          Paced to maintain positive month-end reserve
        </p>
      </div>

      <div className="w-full bg-[#111111]/15 h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#111111] h-full rounded-full"
          style={{ width: '68%' }}
        />
      </div>
    </div>
  );
}
```

### 6.3 Interactive Area Chart Bento Card

Spanning 8 columns on desktop, styled with semantic emerald & rose fills:

```tsx
<div className="bento-card col-span-12 lg:col-span-8 bg-[#27272A] p-6 border border-zinc-800 flex flex-col justify-between">
  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
    <div>
      <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
        Cashflow Dynamics
      </h3>
      <p className="font-mono text-xs text-[#A1A1AA]">
        Inflow vs Outflow Area Comparison
      </p>
    </div>
    {/* Time Filters */}
    <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
      {['1W', '1M', '3M', '6M', '1Y'].map((t) => (
        <button
          key={t}
          className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold ${
            t === '1M'
              ? 'bg-[#C9F31D] text-[#111111]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  </div>

  {/* Chart Container rendered with #34D399 (Income) & #FB7185 (Expense) gradients */}
  <div className="h-[260px] w-full">{/* shadcn chart component here */}</div>
</div>
```
