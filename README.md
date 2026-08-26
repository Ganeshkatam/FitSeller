# FitSeller

FitSeller is a dedicated ecommerce platform and merchant operating system designed specifically for fashion, apparel, and clothing brands. Built with React 19, Vite, TypeScript, and Supabase PostgreSQL, it provides end-to-end tooling for managing product offers, processing customer orders, managing reverse logistics, tracking seller payouts, and monitoring business analytics.

---

## Overview

FitSeller delivers an authentic, multi-tenant operating system for fashion merchants:

- **Public Seller Landing**: Platform overview, commission structure, and seller onboarding entry points.
- **Authentication Suite**: Secure authentication featuring email/password sign-in, Google OAuth, transactional email verification, and password recovery.
- **Progressive Onboarding Flow**: A strictly sequential 6-step registration flow backed by individual semantic routes, volatile memory handling for sensitive inputs, and database-enforced identity linking.
- **Atomic Activation Boundary**: Single-transaction database activation RPC (`activate_seller`) enforcing 6-step compliance validation, unique profile ownership, and automatic wallet provisioning.
- **Merchant Workspace**: Real-time sales metrics, inventory offers, order fulfillment, return management, and wallet balance tracking.
- **Zero-Fabrication Data Principle**: The application exclusively displays actual database records. New or empty stores render authentic empty states without simulated metrics or artificial charts.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Routing | React Router 7 |
| Server State Management | TanStack React Query 5 |
| Database & Authentication | Supabase JS 2 / PostgreSQL 17 |
| Charting & Visualization | Recharts 2 |
| Styling | Tailwind CSS 4 |
| UI Primitives | Radix UI / Accessible component primitives |
| Icons | Lucide React |
| Notifications | Sonner / Toast |
| Typography | Geist Variable Font |

---

## Architecture and Data Integrity

```text
Browser Client (React 19 + Vite 6)
  │
  ├── React Router 7 (Nested & Guarded Routes)
  │     ├── Public Landing: /, /landing, /welcome
  │     ├── Auth Suite: /auth/sign-in, /auth/sign-up, /auth/reset-password, /auth/verify-email
  │     ├── Onboarding: /onboarding/:slug (account, gst, business, shipping, pickup-address, bank)
  │     └── Seller Workspace: /dashboard, /products, /orders, /returns, /payouts, /analytics, /settings
  │
  ├── State & Context Layer
  │     ├── AuthContext: User session, Supabase auth sync, refreshAuth()
  │     ├── OnboardingContext: Sequential step validation, sensitive memory split, draft persistence
  │     └── React Query: Server-state caching and invalidation
  │
  └── Supabase Backend
        ├── Supabase Auth (auth.users)
        │     └── Trigger: handle_new_user() -> public.profiles
        ├── public.profiles (ON DELETE CASCADE from auth.users)
        ├── public.sellers (Strict BEFORE INSERT check: trg_check_seller_valid_user)
        │     ├── Constraint: UNIQUE(profile_id)
        │     └── Trigger: handle_new_seller() -> public.wallets
        ├── public.wallets (ON DELETE CASCADE from public.sellers)
        └── PostgreSQL Row Level Security (RLS)
```

### Relational Integrity and Ownership Hierarchy

A seller account cannot exist in isolation. The application enforces a strict hierarchical relational model at both the application and database levels:

```text
auth.users (id)
      │
      ▼  ON DELETE CASCADE
public.profiles (id)
      │
      ▼  ON DELETE CASCADE (UNIQUE: profile_id)
public.sellers (profile_id)
      │
      ▼  ON DELETE CASCADE (fk_wallets_seller)
public.wallets (seller_id)
```

1. **Atomic Profile Creation**: When a user registers via email or Google OAuth, a PostgreSQL trigger (`handle_new_user`) atomically creates and populates `public.profiles`. Auth transactions abort if profile initialization fails.
2. **Pre-Insert User Verification (`trg_check_seller_valid_user`)**: A `BEFORE INSERT` trigger on `public.sellers` verifies that `auth.users` and `public.profiles` records exist prior to seller creation.
3. **No Unauthenticated Account Creation**: Neither sellers nor wallets are created automatically upon user sign-up. Seller records are created exclusively when the merchant completes onboarding verification.
4. **Database Wallet Initialization**: When a seller record is created, the PostgreSQL trigger `on_seller_created` initializes the associated record in `public.wallets`.
5. **Cascade Deletions**: Deleting an authentication record cascades to delete associated profiles, sellers, wallets, and operational records.

---

## Application Routes

### Public & Authentication Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Seller marketing landing page | Public |
| `/landing`, `/welcome` | Landing page aliases | Public |
| `/auth/sign-in` | Seller sign-in with email or Google | Guest only |
| `/auth/sign-up` | New user registration with real-time password rules | Guest only |
| `/auth/forgot-password` | Password reset request | Guest only |
| `/auth/reset-password` | Update password via recovery token | Mid-session / Recovery |
| `/auth/verify-email` | Email confirmation screen | Mid-session |

### 6-Step Seller Onboarding Wizard

Each step of onboarding resides on its own semantic URL without step numbers. A strict sequential barrier prevents users from jumping ahead until previous steps are completed:

| Route | Step | Key Fields & Validations | Page Component |
| --- | --- | --- | --- |
| `/onboarding` | Entry | Redirects to `/onboarding/account` | Layout coordinator |
| `/onboarding/account` | Step 1 | User account credentials, contact phone, contact person | `Step1AccountPage.tsx` |
| `/onboarding/gst` | Step 2 | 15-character GSTIN format validation, PAN, exemption toggle | `Step2GstPage.tsx` |
| `/onboarding/business` | Step 3 | Public brand name, legal entity name, primary apparel category | `Step3BusinessPage.tsx` |
| `/onboarding/shipping` | Step 4 | Doorstep pickup vs self-ship, partner courier, dispatch window | `Step4ShippingPage.tsx` |
| `/onboarding/pickup-address` | Step 5 | Warehouse address, 6-digit postal PIN code format validation | `Step5PickupAddressPage.tsx` |
| `/onboarding/bank` | Step 6 | Account holder name, account matching check, 11-digit IFSC format validation | `Step6BankPage.tsx` |

**Progression Rules:**
- Attempting to access any subsequent route directly without completing previous steps automatically redirects the user to their earliest incomplete step.
- The interactive stepper indicates completed steps and locks subsequent steps until prerequisites are satisfied.
- **Client Draft Privacy**: Non-sensitive UI workflow progress is saved in `sessionStorage`. Sensitive financial and tax details (bank account number, IFSC code, GSTIN, PAN, full address) are kept in volatile React memory only.

### Authenticated Seller Workspace

Protected by `RequireAuth`. Visitors without an active session are directed to `/auth/sign-in`. Users with an authenticated profile who have not completed onboarding are directed to `/onboarding/account`.

| Route | Description | Access |
| --- | --- | --- |
| `/dashboard` | Executive overview, sales metrics, and performance charts | Authenticated Seller |
| `/products` | Catalog listing, stock levels, variants, and offer management | Authenticated Seller |
| `/orders` | Order processing, dispatch status, tracking numbers | Authenticated Seller |
| `/returns` | Return authorizations, inspection status, reverse logistics | Authenticated Seller |
| `/payouts` | Wallet balance, settlement tracking, payout requests | Authenticated Seller |
| `/analytics` | Category breakdowns, order volume, revenue trends | Authenticated Seller |
| `/settings` | Store profile, brand details, shipping, and preferences | Authenticated Seller |

---

## Business State Machines

The application interfaces directly with PostgreSQL enums and constraints rather than defining client-only statuses:

### Seller Status (`seller_status`)
- `pending`: Onboarding incomplete or draft state.
- `active`: Fully activated merchant eligible to list offers and fulfill orders.
- `suspended`: Temporarily restricted from marketplace activity.
- `terminated`: Permanently closed merchant account.

### Product Offer Status (`product_offer_status`)
- `draft`: Created by merchant but not visible on marketplace.
- `active`: Live on marketplace for customer purchase.
- `paused`: Temporarily hidden from customer purchase.
- `suspended`: Blocked due to administrative action.
- `ended`: Catalog offer decommissioned.

### Order Status (`order_status`)
- `pending_payment`: Awaiting payment confirmation.
- `placed`: Customer order recorded.
- `confirmed`: Order accepted and validated.
- `processing`: Order in fulfillment queue.
- `shipped`: In transit with courier tracking.
- `delivered`: Order received by customer.
- `cancelled`: Order voided before fulfillment.
- `returned`: Order returned and processed.

---

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher
- A Supabase project with PostgreSQL enabled

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not expose Supabase service-role keys in `.env`. Vite bundles environment variables prefixed with `VITE_` into client-side code.

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The development server starts by default at `http://localhost:5173`.

### Verification & Production Build

```bash
# Type check TypeScript files without emitting
npm run typecheck

# Full production build (tsc verification followed by Vite bundle generation)
npm run build

# Preview production build locally
npm run preview
```

---

## Security and Permissions

1. **Row Level Security (RLS)**: PostgreSQL RLS policies enforce tenant boundaries across all public tables (`sellers`, `product_offers`, `orders`, `order_items`, `wallets`, `payouts`).
2. **Authoritative Ownership**: Seller lookups resolve strictly via `sellers.profile_id = auth.uid()`.
3. **Atomic Activation RPC**: `activate_seller` runs with `SECURITY DEFINER` and an immutable `search_path = public, auth`. Execution is restricted to `authenticated` callers and revoked from `public`/`anon`.
4. **Column Exposure Control**: Global authentication context queries project specific operational columns rather than exposing sensitive banking and tax fields.
5. **Transparent Terminology**: Input validations on GSTIN, IFSC, and PIN codes are labeled as format checks rather than external government or banking verification services.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
