# FitSeller

FitSeller is a specialized, high-performance ecommerce platform and seller dashboard designed specifically for fashion, apparel, and clothing brands. Built with React 19, Vite, TypeScript, and Supabase, it provides end-to-end tooling for managing products, tracking customer orders, automated return workflows, nightly payout settlements, and sales analytics.

---

## Overview

FitSeller delivers an end-to-end operating system for fashion merchants:

- **Public Seller Landing & Growth**: Interactive revenue calculator, platform capability showcase, feature roadmaps, and seller onboarding entry points.
- **Authentication Suite**: Streamlined, secure authentication featuring email/password sign-in, Google OAuth, transactional email verification, and password recovery.
- **Multi-Step Onboarding Wizard**: A strictly sequential 6-step registration flow backed by individual routes, persistent drafts, and database-enforced user verification.
- **Merchant Operations Dashboard**: Real-time sales metrics, GMV tracking, inventory cataloging, order fulfillment, return management, and nightly bank settlements.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Routing | React Router 7 |
| Server State Management | TanStack React Query 5 |
| Database & Authentication | Supabase JS 2 / PostgreSQL |
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
  │     ├── OnboardingContext: Sequential step validation, draft persistence (sessionStorage)
  │     └── React Query: Server-state caching and invalidation
  │
  └── Supabase Backend
        ├── Supabase Auth (auth.users)
        │     └── Trigger: handle_new_user() -> public.profiles
        ├── public.profiles (ON DELETE CASCADE from auth.users)
        ├── public.sellers (Strict BEFORE INSERT check: trg_check_seller_valid_user)
        │     └── Trigger: handle_new_seller() -> public.wallets
        ├── public.wallets (ON DELETE CASCADE from public.sellers)
        └── PostgreSQL Row Level Security (RLS)
```

### Relational Integrity and Orphan Prevention

A seller account cannot exist in isolation. The application enforces a strict hierarchical relational model at both the application and database levels:

```text
auth.users (id)
      │
      ▼  ON DELETE CASCADE
public.profiles (id)
      │
      ▼  ON DELETE CASCADE (fk_sellers_profile)
public.sellers (profile_id)
      │
      ▼  ON DELETE CASCADE (fk_wallets_seller)
public.wallets (seller_id)
```

1. **Atomic Profile Creation**: When a user registers via email or Google OAuth, a PostgreSQL trigger (`handle_new_user`) atomically creates and populates `public.profiles`. Auth transactions abort if profile initialization fails.
2. **Database Pre-Insert Guard (`trg_check_seller_valid_user`)**: A `BEFORE INSERT` trigger on `public.sellers` queries `auth.users` and `public.profiles`. If a valid user account does not exist, the insert is rejected with an exception.
3. **No Silent Account Creation**: Neither sellers nor wallets are created automatically upon user sign-up. Seller records are created exclusively when the merchant completes onboarding.
4. **Database Wallet Initialization**: When a seller record is created, the PostgreSQL trigger `on_seller_created` initializes the associated record in `public.wallets`.
5. **Cascade Deletions**: Deleting a user cleanly cascades to delete profiles, sellers, wallets, and analytics events without leaving orphaned data.

---

## Application Routes

### Public & Authentication Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Seller marketing landing page | Public |
| `/landing`, `/welcome` | Landing page aliases | Public |
| `/auth/sign-in` | Seller sign-in with email or Google | Guest only |
| `/auth/sign-up` | New user registration (40/60 split, live password rules) | Guest only |
| `/auth/forgot-password` | Password reset request | Guest only |
| `/auth/reset-password` | Update password via recovery token | Mid-session / Recovery |
| `/auth/verify-email` | Email confirmation screen | Mid-session |

### 6-Step Seller Onboarding Wizard

Each step of onboarding resides on its own semantic URL without step numbers. A strict sequential barrier prevents users from jumping ahead until previous steps are completed:

| Route | Step | Key Fields & Validations | Page Component |
| --- | --- | --- | --- |
| `/onboarding` | Entry | Redirects to `/onboarding/account` | Layout coordinator |
| `/onboarding/account` | Step 1 | User account authentication, email, mobile, full name | `Step1AccountPage.tsx` |
| `/onboarding/gst` | Step 2 | 15-character GSTIN, auto PAN extraction, exemption toggle | `Step2GstPage.tsx` |
| `/onboarding/business` | Step 3 | Seller display name, clothing brand name, primary apparel category | `Step3BusinessPage.tsx` |
| `/onboarding/shipping` | Step 4 | Doorstep pickup vs self-ship, preferred couriers, dispatch window | `Step4ShippingPage.tsx` |
| `/onboarding/pickup-address` | Step 5 | Warehouse address, 6-digit PIN code auto-fill for city/state | `Step5PickupAddressPage.tsx` |
| `/onboarding/bank` | Step 6 | Account holder name, account matching check, 11-digit IFSC code | `Step6BankPage.tsx` |

**Progression Rules:**
- Attempting to access any subsequent route directly without completing previous steps automatically redirects the user to their earliest incomplete step.
- The interactive stepper disables and locks future steps until the current step is completed.
- Draft inputs are automatically persisted in `sessionStorage` to preserve progress across refreshes and browser navigation.

### Authenticated Seller Workspace

Protected by `RequireAuth`. Visitors without an active session are directed to `/auth/sign-in`. Users with an authenticated profile who have not completed onboarding are directed to `/onboarding/account`.

| Route | Description | Access |
| --- | --- | --- |
| `/dashboard` | Executive overview, sales metrics, and performance charts | Authenticated Seller |
| `/products` | Catalog listing, stock levels, variants, and offer management | Authenticated Seller |
| `/orders` | Order processing, dispatch status, tracking numbers | Authenticated Seller |
| `/returns` | Return authorizations, inspection status, reverse logistics | Authenticated Seller |
| `/payouts` | Daily settlement history, bank deposits, statement exports | Authenticated Seller |
| `/analytics` | Conversion rates, top apparel categories, revenue trends | Authenticated Seller |
| `/settings` | Store profile, brand details, shipping, and notification preferences | Authenticated Seller |

---

## Project Structure

```text
.
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.tsx
    │   │   ├── AppLayout.tsx
    │   │   └── AppSidebar.tsx
    │   ├── onboarding/
    │   │   ├── OnboardingHeader.tsx
    │   │   ├── OnboardingLayout.tsx
    │   │   ├── OnboardingNavigation.tsx
    │   │   ├── OnboardingStepper.tsx
    │   │   ├── OnboardingSuccess.tsx
    │   │   ├── OnboardingTypes.ts
    │   │   ├── Step1Account.tsx
    │   │   ├── Step2Gst.tsx
    │   │   ├── Step3Business.tsx
    │   │   ├── Step4Shipping.tsx
    │   │   ├── Step5PickupAddress.tsx
    │   │   └── Step6Bank.tsx
    │   └── ui/
    │       ├── Badge.tsx
    │       ├── button.tsx
    │       ├── Field.tsx
    │       ├── modal.tsx
    │       ├── States.tsx
    │       ├── table.tsx
    │       └── Toast.tsx
    ├── contexts/
    │   ├── AuthContext.tsx
    │   └── OnboardingContext.tsx
    ├── lib/
    │   ├── offers.ts
    │   ├── supabase.ts
    │   └── utils.ts
    ├── pages/
    │   ├── Analytics.tsx
    │   ├── Dashboard.tsx
    │   ├── GlobalError.tsx
    │   ├── Orders.tsx
    │   ├── Payouts.tsx
    │   ├── Products.tsx
    │   ├── Returns.tsx
    │   ├── SellerLanding.tsx
    │   ├── Settings.tsx
    │   ├── auth/
    │   │   ├── ForgotPassword.tsx
    │   │   ├── ResetPassword.tsx
    │   │   ├── SignIn.tsx
    │   │   ├── SignUp.tsx
    │   │   └── VerifyEmail.tsx
    │   └── onboarding/
    │       ├── Step1AccountPage.tsx
    │       ├── Step2GstPage.tsx
    │       ├── Step3BusinessPage.tsx
    │       ├── Step4ShippingPage.tsx
    │       ├── Step5PickupAddressPage.tsx
    │       └── Step6BankPage.tsx
    └── types/
        ├── database.ts
        └── index.ts
```

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

### Type Checking & Production Build

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

1. **Row Level Security (RLS)**: PostgreSQL RLS policies enforce tenant boundaries. Queries are scoped to `auth.uid() = profile_id` on the database level.
2. **User-First Verification**: Seller profile creation requires an existing, authenticated user profile verified by PostgreSQL pre-insert triggers.
3. **Encrypted Credentials**: Password hashing, token management, and OAuth flows are delegated to Supabase Auth. Sensitive merchant bank details are encrypted and restricted to payout processing.
4. **Client Hardening**: No administrative service-role keys are exposed to the browser. All client mutations pass through RLS with strict constraints.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
