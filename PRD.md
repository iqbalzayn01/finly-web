# Finly Web — Frontend Product Requirements Document (PRD)

## 1. Overview
Finly is a B2B cashflow OS designed for agencies, consultants, freelancers, and micro-SMEs.
This document outlines the product requirements and technical specifications specifically for the **frontend** web application (`app.finly.io`).

## 2. Tech Stack & Aesthetics

### 2.1 Core Technologies
*   **Framework**: React 18 (Vite)
*   **Routing**: TanStack Router
*   **Data Fetching & Server State**: TanStack Query
*   **Local State**: Zustand
*   **Data Handling**: TanStack Table (data grids), TanStack Form (form management), TanStack Charts (visualizations)
*   **API Client**: Axios or native fetch, configured for session cookies (`credentials: true`) and CSRF token handling.

### 2.2 UI, Styling, and Animations
*   **Styling**: Tailwind CSS
*   **Component Libraries**: shadcn/ui, 21st.dev
*   **Design System**: Material Design 3 (M3)
*   **Animations**: Motion (Framer Motion)
*   **Typography**: IBM Plex

### 2.3 Aesthetics
*   **Vibe**: Premium modern finance app (Dribbble-inspired). 
*   **Visual Excellence**: Avoid basic MVP looks. Utilize curated harmonious color palettes, sleek dark mode, smooth gradients, and subtle micro-animations for interactions.
*   **Typography**: IBM Plex for clean, professional data presentation.

## 3. Core Features (Scope)

### 3.1 Authentication & Onboarding
*   **Auth Mechanism**: Session cookie-based authentication with a CSRF layer. The frontend must re-fetch the CSRF token immediately after a successful login (as the session ID changes).
*   **Login Flow**: Standard email/password login.
*   **Onboarding**: Setup initial business profile (tenant creation) and essential initial data.
*   **RBAC**: Support for 4 roles: `viewer`, `editor`, `admin`, `owner`. The UI must conditionally render actions based on the active user's role in the current business.

### 3.2 Dashboard
*   **Cashflow Overview**: Visual summary of income and expenses.
*   **Metrics**: Receivables, Operating Expense Ratio (OER - filtered by `scope = 'business'`).
*   **Charts**: Interactive charts using TanStack Charts to visualize financial health.

### 3.3 Cashbook (Transactions)
*   **Ledger View**: Comprehensive list of transactions using TanStack Table with filtering (date, category, type, scope) and sorting.
*   **Entry Creation**: Form to record income and expenses (TanStack Form).
*   **Receipts**: Ability to upload receipts. The backend returns a short-lived signed URL for rendering the receipt image (`receipt_path`).
*   **Money Handling**: All money inputs must be converted to minor units (cents) before sending to the backend, and all money displays must correctly format cents to standard currency.

### 3.4 Invoices
*   **Invoice Builder**: Dynamic form to create invoices, add line items, apply discounts (basis points), and calculate taxes.
*   **Calculation Logic**: The frontend should preview the exact calculation order defined by the backend:
    *   `line_total = round(unit_price × quantity_milli / 1000)`
    *   `subtotal = Σ line_total`
    *   `discount = round(subtotal × discount_bps / 10_000)`
    *   `taxable_base = subtotal − discount`
    *   `tax_amount = round(taxable_base × tax_bps / 10_000)`
    *   `total = taxable_base + tax_amount`
*   **Status Tracking**: Display derived status (Draft, Unpaid, Paid, Void, Overdue [Unpaid + past due date]).
*   **Actions**: Download PDF, Send via Email, Mark as Paid (triggers cashbook sync), Void.

### 3.5 Catalog (Items & Categories)
*   **Products/Services (Items)**: Manage standard catalog items, including `default_price_in_cents` and `default_tax_bps`.
*   **Categories**: Manage transaction categories for the business.

### 3.6 Customers
*   **Directory**: Manage client details (name, email, tax number).

### 3.7 Settings & Team Management
*   **Business Profile**: Edit company details and upload logo (`logo_path`).
*   **Members**: Interface to invite team members and assign roles (requires `admin` or `owner` role). Ensure partial unique constraints are respected (e.g., only one active owner).
*   **Audit Log**: Read-only view of the business's immutable audit history.

## 4. Engineering Standards & Rules

### 4.1 Data Formatting
*   **Never parse floats**: Use a dedicated `Money` utility for formatting cents to string for display. Do not use `Number()` or `parseFloat()` on currency values from the API.

### 4.2 Security
*   **Cross-Site Request Forgery (CSRF)**: Must integrate smoothly with the backend's `csrf-csrf` middleware.

### 4.3 Architecture
*   **Component Structure**: Build reusable components reflecting M3 guidelines.
*   **Feature-First Organization**: Group code by feature (e.g., `features/invoices`, `features/cashbook`) rather than by type (e.g., all components, all hooks).

## 5. Out of Scope (Phase 2 Deferred)
Do **not** build the following features unless explicitly requested to move them to Phase 1:
*   AI assistant
*   Multi-currency per business
*   Recurring invoices
*   Payment gateways
*   Receipt OCR
*   Bank feeds
*   Field-level encryption of tax number
