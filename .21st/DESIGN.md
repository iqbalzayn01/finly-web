# Finly — Design System & Style Guide (DESIGN.md)

**Project:** `finly-web`  
**Stack Architecture:** React 19, Vite, shadcn/ui, Tailwind CSS v4  
**Design Aesthetic:** Simple, Modern, Minimalist, Neumorphism (Soft UI)  
**Primary Typography:** Geist Mono (`@fontsource-variable/geist-mono`) across all elements  
**Color Palette:** Pure Neutral Monochromatic Scale (White, Gray, Deep Black) across all UI elements and the brand logo; Semantic Emerald & Rose reserved strictly for data charts  
**Top Bar:** Pure White (`bg-white dark:bg-zinc-950`), completely borderless (`border-none shadow-none`)  
**Main Content Container:** Pure White (`bg-white dark:bg-zinc-900`) with rounded top-left and top-right corners (`rounded-t-[32px] sm:rounded-t-[40px]`)  

---

## 1. Brand Identity & Neutral Logo Specifications

### 1.1 Brand Concept & Geometry
The Finly brand mark is an 8-pointed geometric spark rendered strictly in a clean, neutral monochromatic tone. It signifies precision, balance, and modern financial clarity without relying on colorful fills.

### 1.2 Official Master SVG Asset (1000 × 1000)
```xml
<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_28_73)">
<path d="M479.046 321.452C471.944 260.588 464.484 196.659 463.089 124.002C462.835 110.75 473.603 100 486.858 100H513.142C526.397 100 537.165 110.75 536.907 124.003C535.507 195.861 528.089 259.647 521.004 320.508C517.042 354.558 513.186 387.694 510.551 420.816C508.817 442.62 534.337 453.189 548.522 436.54C569.878 411.474 590.364 385.573 611.44 358.926C649.451 310.869 689.384 260.389 739.771 208.029C748.962 198.478 764.178 198.491 773.551 207.864L792.137 226.45C801.51 235.823 801.523 251.039 791.969 260.227C740.165 310.048 689.812 349.903 641.768 387.932L641.718 387.97C614.86 409.232 588.723 429.922 563.457 451.465C546.813 465.657 557.385 491.178 579.189 489.435C612.008 486.812 644.805 482.985 678.544 479.048C739.408 471.944 803.341 464.484 875.998 463.089C889.25 462.835 900 473.603 900 486.858V513.142C900 526.397 889.25 537.165 875.997 536.907C804.141 535.506 740.356 528.085 679.498 521.004L679.448 521C645.414 517.04 612.296 513.187 579.192 510.554C557.387 508.819 546.817 534.341 563.468 548.526C588.507 569.857 614.381 590.323 640.998 611.374L641.066 611.432C689.126 649.447 739.609 689.378 791.973 739.771C801.523 748.963 801.51 764.178 792.138 773.55L773.55 792.138C764.178 801.51 748.962 801.523 739.774 791.97C689.952 740.168 650.099 689.818 612.076 641.778L611.976 641.64L611.892 641.53C590.675 614.737 570.027 588.662 548.532 563.454C534.34 546.81 508.817 557.382 510.552 579.185C513.186 612.307 517.042 645.442 521.004 679.492C528.089 740.354 535.507 804.138 536.907 875.997C537.165 889.25 526.397 900 513.142 900H486.858C473.603 900 462.835 889.25 463.089 875.998C464.484 803.342 471.944 739.412 479.046 678.548L479.062 678.438C482.993 644.737 486.814 611.976 489.434 579.193C491.177 557.389 465.655 546.816 451.463 563.46C429.969 588.666 409.323 614.739 388.108 641.53L388.024 641.64L387.924 641.778C349.901 689.818 310.048 740.168 260.227 791.97C251.039 801.523 235.823 801.51 226.45 792.138L207.863 773.55C198.491 764.178 198.477 748.963 208.028 739.772C260.391 689.378 310.874 649.447 358.934 611.432L359.002 611.374C385.618 590.323 411.492 569.858 436.53 548.527C453.181 534.342 442.611 508.82 420.806 510.554C387.686 513.189 354.552 517.043 320.502 521.004C259.644 528.085 195.859 535.506 124.003 536.907C110.75 537.165 100 526.397 100 513.142V486.858C100 473.603 110.75 462.835 124.002 463.089C196.66 464.484 260.593 471.944 321.456 479.048C355.195 482.985 387.991 486.812 420.809 489.435C442.613 491.178 453.186 465.656 436.541 451.465C411.26 429.909 385.107 409.207 358.232 387.932C310.188 349.903 259.834 310.048 208.031 260.227C198.478 251.039 198.491 235.823 207.863 226.45L226.45 207.864C235.823 198.491 251.038 198.478 260.229 208.029C310.616 260.389 350.549 310.869 388.56 358.926C409.635 385.57 430.119 411.469 451.473 436.532C465.658 453.182 491.177 442.61 489.434 420.807C486.814 388.024 482.993 355.263 479.062 321.562L479.046 321.452Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_28_73">
<rect width="1000" height="1000" fill="white"/>
</clipPath>
</defs>
</svg>
```

### 1.3 React Logo Component (`src/components/brand-logo.tsx`)
```tsx
import React from "react";

interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function BrandLogo({ size = 28, className = "", ...props }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-zinc-900 dark:text-white transition-opacity hover:opacity-80 ${className}`}
      {...props}
    >
      <g clipPath="url(#finly_logo_clip)">
        <path
          d="M479.046 321.452C471.944 260.588 464.484 196.659 463.089 124.002C462.835 110.75 473.603 100 486.858 100H513.142C526.397 100 537.165 110.75 536.907 124.003C535.507 195.861 528.089 259.647 521.004 320.508C517.042 354.558 513.186 387.694 510.551 420.816C508.817 442.62 534.337 453.189 548.522 436.54C569.878 411.474 590.364 385.573 611.44 358.926C649.451 310.869 689.384 260.389 739.771 208.029C748.962 198.478 764.178 198.491 773.551 207.864L792.137 226.45C801.51 235.823 801.523 251.039 791.969 260.227C740.165 310.048 689.812 349.903 641.768 387.932L641.718 387.97C614.86 409.232 588.723 429.922 563.457 451.465C546.813 465.657 557.385 491.178 579.189 489.435C612.008 486.812 644.805 482.985 678.544 479.048C739.408 471.944 803.341 464.484 875.998 463.089C889.25 462.835 900 473.603 900 486.858V513.142C900 526.397 889.25 537.165 875.997 536.907C804.141 535.506 740.356 528.085 679.498 521.004L679.448 521C645.414 517.04 612.296 513.187 579.192 510.554C557.387 508.819 546.817 534.341 563.468 548.526C588.507 569.857 614.381 590.323 640.998 611.374L641.066 611.432C689.126 649.447 739.609 689.378 791.973 739.771C801.523 748.963 801.51 764.178 792.138 773.55L773.55 792.138C764.178 801.51 748.962 801.523 739.774 791.97C689.952 740.168 650.099 689.818 612.076 641.778L611.976 641.64L611.892 641.53C590.675 614.737 570.027 588.662 548.532 563.454C534.34 546.81 508.817 557.382 510.552 579.185C513.186 612.307 517.042 645.442 521.004 679.492C528.089 740.354 535.507 804.138 536.907 875.997C537.165 889.25 526.397 900 513.142 900H486.858C473.603 900 462.835 889.25 463.089 875.998C464.484 803.342 471.944 739.412 479.046 678.548L479.062 678.438C482.993 644.737 486.814 611.976 489.434 579.193C491.177 557.389 465.655 546.816 451.463 563.46C429.969 588.666 409.323 614.739 388.108 641.53L388.024 641.64L387.924 641.778C349.901 689.818 310.048 740.168 260.227 791.97C251.039 801.523 235.823 801.51 226.45 792.138L207.863 773.55C198.491 764.178 198.477 748.963 208.028 739.772C260.391 689.378 310.874 649.447 358.934 611.432L359.002 611.374C385.618 590.323 411.492 569.858 436.53 548.527C453.181 534.342 442.611 508.82 420.806 510.554C387.686 513.189 354.552 517.043 320.502 521.004C259.644 528.085 195.859 535.506 124.003 536.907C110.75 537.165 100 526.397 100 513.142V486.858C100 473.603 110.75 462.835 124.002 463.089C196.66 464.484 260.593 471.944 321.456 479.048C355.195 482.985 387.991 486.812 420.809 489.435C442.613 491.178 453.186 465.656 436.541 451.465C411.26 429.909 385.107 409.207 358.232 387.932C310.188 349.903 259.834 310.048 208.031 260.227C198.478 251.039 198.491 235.823 207.863 226.45L226.45 207.864C235.823 198.491 251.038 198.478 260.229 208.029C310.616 260.389 350.549 310.869 388.56 358.926C409.635 385.57 430.119 411.469 451.473 436.532C465.658 453.182 491.177 442.61 489.434 420.807C486.814 388.024 482.993 355.263 479.062 321.562L479.046 321.452Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="finly_logo_clip">
          <rect width="1000" height="1000" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
```

---

## 2. Monochromatic Neutral Palette & Neumorphic Design System

### 2.1 The Neutral Scale & Chart Color Exception
* **Monochromatic Hierarchy:** Every card, button, tab, badge, input, and boundary control strictly utilizes the neutral grayscale spectrum (pure white `#FFFFFF`, zinc scale `zinc-50` through `zinc-950`, and rich black).
* **The Single Chart Exception:** Semantic color is exclusively applied to data series inside the **shadcn/ui Area Chart**:
  * **Income Series:** Emerald (`#10B981`)
  * **Expenses Series:** Rose (`#F43F5E`)

### 2.2 Neumorphic Elevation & Shadow Tokens
Finly uses modern, refined Neumorphism—clean soft extrusion without muddy textures:
* **Raised / Extruded (Cards & Modals):**
  * Light Mode: `shadow-[6px_6px_16px_rgba(0,0,0,0.05),-6px_-6px_16px_rgba(255,255,255,0.9)]`
  * Dark Mode: `shadow-[6px_6px_16px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)]`
* **Inset / Concave (Active Tabs, Pressed Buttons & Text Inputs):**
  * Light Mode: `shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-3px_-3px_6px_rgba(255,255,255,0.8)]`
  * Dark Mode: `shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(255,255,255,0.04)]`

---

## 3. Structural Shell: Top Bar & Main Content Container

### 3.1 Borderless Pure White Top Bar
* **Styling:** `bg-white dark:bg-zinc-950 border-none shadow-none`
* Contains brand logo (left), center navigation pills (center), and utilities/profile avatar (right).
* Completely eliminates dividers, borders, or backdrop blurs to achieve an airy, minimalist look.

### 3.2 Main Content Container Geometry
* **Styling:** `bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-t-[40px] px-4 sm:px-8 pt-8 pb-16`
* Sits inside the page wrapper, cradling all cards, charts, and tables with smooth rounded top shoulders.

---

## 4. Typography: Geist Mono Standard

All textual elements in Finly are rendered in **Geist Mono** (`@fontsource-variable/geist-mono`):

```css
@theme {
  --font-mono: 'Geist Mono', monospace;
  --font-sans: 'Geist Mono', monospace;
}
```

### 4.1 Typography Scale
| Element | Class Definition | Usage |
| :--- | :--- | :--- |
| **Hero Numbers** | `font-mono text-3xl sm:text-4xl font-bold tracking-tight tabular-nums` | Main Balance, Safe-to-Spend |
| **Metric Headers** | `font-mono text-xs uppercase tracking-widest text-zinc-400` | Card categories and labels |
| **Body & Buttons** | `font-mono text-sm font-medium tracking-normal` | Navigation, inputs, buttons |
| **Table Cells & Dates** | `font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-300` | Transaction amounts, timestamps |

---

## 5. Tailwind CSS v4 Theme Configuration (`src/index.css`)

```css
@import "tailwindcss";

@layer base {
  :root {
    /* Pure Neutral Palette */
    --background: #f4f4f5; /* Zinc-100 canvas */
    --foreground: #09090b; /* Zinc-950 text */

    /* Cards & Containers */
    --card: #ffffff;
    --card-foreground: #09090b;

    /* Primaries (Strictly Monochromatic) */
    --primary: #09090b;
    --primary-foreground: #ffffff;

    --muted: #f4f4f5;
    --muted-foreground: #71717a;

    --border: #e4e4e7;
    --input: #f4f4f5;
    --ring: #18181b;

    /* Chart Semantic Exception */
    --chart-income: #10b981;
    --chart-expense: #f43f5e;

    /* Neumorphic Shadows */
    --shadow-neu-flat: 6px 6px 14px rgba(0, 0, 0, 0.04), -6px -6px 14px rgba(255, 255, 255, 0.9);
    --shadow-neu-raised: 8px 8px 20px rgba(0, 0, 0, 0.06), -8px -8px 20px rgba(255, 255, 255, 0.95);
    --shadow-neu-inset: inset 3px 3px 6px rgba(0, 0, 0, 0.05), inset -3px -3px 6px rgba(255, 255, 255, 0.85);

    --radius: 1rem;
  }

  .dark {
    --background: #09090b;
    --foreground: #fafafa;

    --card: #18181b;
    --card-foreground: #fafafa;

    --primary: #fafafa;
    --primary-foreground: #09090b;

    --muted: #27272a;
    --muted-foreground: #a1a1aa;

    --border: #27272a;
    --input: #18181b;
    --ring: #d4d4d8;

    --chart-income: #10b981;
    --chart-expense: #f43f5e;

    --shadow-neu-flat: 6px 6px 16px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.03);
    --shadow-neu-raised: 8px 8px 22px rgba(0, 0, 0, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.04);
    --shadow-neu-inset: inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.05);
  }

  body {
    font-family: var(--font-mono);
    background-color: var(--background);
    color: var(--foreground);
    letter-spacing: -0.01em;
  }
}

/* Custom Neumorphism Utilities */
@utility shadow-neu-flat {
  box-shadow: var(--shadow-neu-flat);
}

@utility shadow-neu-raised {
  box-shadow: var(--shadow-neu-raised);
}

@utility shadow-neu-inset {
  box-shadow: var(--shadow-neu-inset);
}
```

---

## 6. Component Matrix & Neumorphic Styling

### 6.1 Top Bar Navigation (`src/components/top-bar.tsx`)
```tsx
<header className="w-full bg-white dark:bg-zinc-950 border-none shadow-none py-4 px-6 flex items-center justify-between">
  {/* Left: Brand Logo + Wordmark */}
  <div className="flex items-center gap-3">
    <BrandLogo size={26} />
    <span className="font-mono font-bold tracking-tight text-lg text-zinc-900 dark:text-white">
      Finly
    </span>
  </div>

  {/* Center: Neumorphic Inset Navigation Group */}
  <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 shadow-neu-inset">
    <NavLink to="/" className={({ isActive }) => 
      `px-5 py-2 rounded-xl font-mono text-xs font-semibold tracking-wider transition-all ${
        isActive 
          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-neu-flat" 
          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      }`
    }>
      DASHBOARD
    </NavLink>
    <NavLink to="/history" className={({ isActive }) => ...}>
      HISTORY
    </NavLink>
    <NavLink to="/invoices" className={({ isActive }) => ...}>
      INVOICES
    </NavLink>
  </nav>

  {/* Right: Theme Toggle & Profile Avatar */}
  <div className="flex items-center gap-3">
    <ThemeToggle />
    <ProfileDropdown />
  </div>
</header>
```

### 6.2 Main Content Shell (`src/components/layout-shell.tsx`)
```tsx
<div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col">
  <TopBar />
  <main className="flex-1 w-full max-w-7xl mx-auto bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-t-[40px] px-6 sm:px-10 pt-8 pb-20 shadow-neu-flat">
    <Outlet />
  </main>
</div>
```

### 6.3 Metric Card Specification
```tsx
<div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-neu-raised border border-zinc-100/80 dark:border-zinc-800/80">
  <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">Total Balance</p>
  <p className="font-mono text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-2 tabular-nums">
    $4,250.00
  </p>
  <p className="font-mono text-xs text-zinc-400 mt-1">Available in 2 wallets</p>
</div>
```

### 6.4 Primary Action Button
```tsx
<button className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-neu-flat hover:opacity-95 active:shadow-neu-inset active:scale-[0.99] transition-all">
  + Record Transaction
</button>
```

### 6.5 Interactive Chart Tooltip Popover
```tsx
<div className="rounded-xl bg-white dark:bg-zinc-900 p-3 shadow-neu-raised border border-zinc-100 dark:border-zinc-800 font-mono text-xs">
  <p className="text-zinc-400">{label}</p>
  <div className="mt-2 space-y-1">
    <p className="text-emerald-500 font-semibold">Income: ${income.toFixed(2)}</p>
    <p className="text-rose-500 font-semibold">Expenses: ${expenses.toFixed(2)}</p>
  </div>
</div>
```

---

## 7. Pre-Flight Verification Checklist

* [ ] **Geist Mono Standard:** Rendered across all UI screens via `@fontsource-variable/geist-mono`.
* [ ] **Persona Switching Removed:** Zero persona selectors in any view or dropdown.
* [ ] **Monochrome Neutrals Everywhere:** Buttons, cards, and logo use the neutral palette; Emerald and Rose are reserved strictly for the Area Chart series.
* [ ] **Top Bar Background:** Pure white background, zero border, zero divider (`bg-white dark:bg-zinc-950 border-none shadow-none`).
* [ ] **Main Content Rounded Shoulders:** White container with `rounded-t-[32px] sm:rounded-t-[40px]`.
* [ ] **Neumorphic Interaction:** Tactile raised shadows on cards, inset shadows on active tabs and inputs.