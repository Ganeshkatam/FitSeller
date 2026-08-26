# FitSeller

**FitSeller** is a seller-facing ecommerce dashboard for managing a fashion/ecommerce seller business. The current application is a client-rendered React + TypeScript dashboard backed directly by Supabase.

## Repository

| Property | Value |
| --- | --- |
| Repository | `Ganeshkatam/FitSeller` |
| GitHub URL | https://github.com/Ganeshkatam/FitSeller |
| Default branch | `main` |
| Visibility | Public |
| Repository type | Application repository |
| Primary language | TypeScript |
| License | MIT License |
| Fork | No |
| Archived | No |
| Disabled | No |
| GitHub Issues | Enabled |
| GitHub Projects | Enabled |
| GitHub Wiki | Enabled |
| Pull Requests | Enabled |
| Discussions | Disabled |
| GitHub Pages | Disabled |
| Downloads | Disabled |
| Forking | Allowed |
| Releases | Supported by repository configuration |
| Open issues | 0 |
| Stars | 0 |
| Forks | 0 |
| Watchers | 0 |
| Created | 2026-08-26 |

The repository is currently public and its default branch is `main`. fileciteturn13file0L2-L2

> **Project status:** early-stage application. The repository currently contains the frontend application and Supabase client integration; database migrations/schema and automated CI are not included in the current repository tree.

## Overview

FitSeller provides an authenticated seller workspace for:

- Dashboard and seller performance metrics
- Product management
- Order management
- Returns
- Payouts
- Analytics
- Seller settings
- Offer-related functionality
- Try-on session metrics

The application uses Supabase Auth for identity and Supabase/Postgres for application data. React Query manages server-state fetching/caching, while React Router handles the authenticated application routes.

## Technology stack

| Area | Technology |
| --- | --- |
| Language | TypeScript 5.8 |
| UI | React 19 |
| Build tool | Vite 6 |
| Routing | React Router 7 |
| Server state | TanStack React Query 5 |
| Backend/data | Supabase JS 2 / PostgreSQL |
| Authentication | Supabase Auth |
| Charts | Recharts 2 |
| Styling | Tailwind CSS 4 |
| UI primitives | Radix UI / shadcn-style components |
| Icons | Lucide React |
| Notifications | Sonner |
| Font | Geist variable font |

Dependency versions are defined in `package.json` and should be treated as the source of truth. fileciteturn4file0L2-L2

## Application architecture

```text
Browser
  │
  ├── React 19 + Vite
  │     ├── App routing
  │     ├── Lazy-loaded pages
  │     ├── Shared UI components
  │     └── AuthContext
  │
  ├── TanStack React Query
  │     └── Server-state caching/fetching
  │
  └── Supabase JS
        ├── Supabase Auth
        └── PostgreSQL / RLS
```

The current `App.tsx` lazy-loads the Login, Dashboard, Products, Orders, Returns, Payouts, Analytics, and Settings pages and gates the application on the Supabase session. fileciteturn5file0L2-L2

## Repository structure

```text
.
├── .env.example
├── .gitignore
├── components.json
├── index.html
├── package.json
├── package-lock.json
├── LICENSE
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── dashboard/
    │   ├── layout/
    │   └── ui/
    ├── contexts/
    │   └── AuthContext.tsx
    ├── lib/
    │   ├── offers.ts
    │   ├── supabase.ts
    │   └── utils.ts
    └── pages/
        ├── Analytics.tsx
        ├── Dashboard.tsx
        ├── Login.tsx
        ├── Orders.tsx
        ├── Payouts.tsx
        ├── Products.tsx
        ├── Returns.tsx
        └── Settings.tsx
```

## Features and data flows

### Authentication

`AuthContext` maintains the Supabase session, exposes sign-in/sign-up/sign-out operations, and loads the authenticated user's profile and seller context. The Supabase client is configured with persistent sessions and automatic token refresh. fileciteturn6file0L2-L2 fileciteturn7file0L2-L2

Seller lookup currently attempts `profile_id` first and then falls back to `business_email`. The stable long-term ownership relationship should be `profile_id`; email matching should not be relied upon as an authorization mechanism. fileciteturn6file0L2-L2

### Dashboard

The dashboard currently queries seller-scoped `order_items` for earnings and sales metrics, `product_offers` for active offers, and `order_items` for returns. It also queries `tryon_sessions` for try-on counts. The earnings chart aggregates the previous 14 days in the client. fileciteturn10file0L2-L2

Current dashboard concepts include:

- Net seller earnings
- Units sold
- Active offers
- Try-on sessions
- 14-day earnings trend
- Best sellers by earnings
- Recent sales
- Monthly earnings
- Returns
- GMV

## Routes

| Route | Screen | Access |
| --- | --- | --- |
| `/` | Dashboard | Authenticated |
| `/products` | Products | Authenticated |
| `/orders` | Orders | Authenticated |
| `/returns` | Returns | Authenticated |
| `/payouts` | Payouts | Authenticated |
| `/analytics` | Analytics | Authenticated |
| `/settings` | Settings | Authenticated |

Unauthenticated users are directed to the login experience; unknown authenticated routes redirect to `/`. fileciteturn5file0L2-L2

## Local development

### Requirements

- Node.js 20+
- npm
- A Supabase project
- Supabase Auth configured for email/password authentication

### Environment

Copy `.env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase client validates that both variables exist at application startup. fileciteturn7file0L2-L2

Do **not** put a Supabase service-role key in any `VITE_*` variable. Vite exposes `VITE_*` values to browser code.

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Typecheck

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

The build currently runs `tsc --noEmit` before `vite build`. fileciteturn4file0L2-L2

### Preview production build

```bash
npm run preview
```

## Supabase security model

The browser talks directly to Supabase, so PostgreSQL Row Level Security is the actual tenant-security boundary. Client-side `.eq("seller_id", sellerId)` filters are useful for query correctness and performance but **are not authorization**.

Production deployments should ensure:

1. RLS is enabled on every browser-accessible application table.
2. Seller-owned rows are restricted to the authenticated user's seller/profile relationship.
3. Policies do not trust a `seller_id` supplied by the browser.
4. Service-role credentials never reach frontend code.
5. Sensitive columns are excluded from normal client queries.
6. Foreign keys enforce seller/profile ownership relationships where appropriate.
7. Indexes support common RLS predicates and seller-scoped queries.
8. Reporting functions/views do not bypass tenant isolation.

### Important current security consideration

The dashboard's try-on count currently queries `tryon_sessions` without an explicit seller filter. fileciteturn10file0L2-L2 If `tryon_sessions` is multi-tenant data, its RLS policy must independently prevent cross-seller visibility. Prefer making the query explicitly seller-scoped as well.

## Data and reporting considerations

The dashboard currently performs some aggregation in the browser after fetching `order_items`. fileciteturn10file0L2-L2 This is acceptable for a small prototype but should not become the production reporting strategy.

At scale, prefer:

- SQL aggregate queries
- Indexed views
- Supabase RPC functions for controlled reporting operations
- Materialized/pre-aggregated reporting tables for expensive analytics
- Explicit date-range constraints
- Pagination for transactional lists

This prevents large historical datasets from being transferred to every browser just to calculate totals.

## Error handling

The current frontend contains several Supabase queries where the response `error` should be handled explicitly rather than relying only on empty/null data states. Production data-access functions should return typed success/error results or throw structured errors that React Query can expose through predictable UI states.

Recommended error contract:

```text
Data access layer
  ├── success → typed domain data
  └── failure → typed/structured error
                    ├── code
                    ├── message
                    └── safe user-facing context
```

Never expose database internals, credentials, SQL statements, or stack traces to end users.

## Performance

The application already uses route-level code splitting through React `lazy`/`Suspense` and server-state caching through TanStack React Query. fileciteturn5file0L2-L2

For continued performance improvements:

- Keep queries seller-scoped and date-bounded.
- Select only required columns instead of `select("*")` where possible.
- Add database indexes matching common filters/order clauses.
- Paginate large orders/products tables.
- Move heavy aggregation to PostgreSQL.
- Use appropriate React Query `staleTime`/cache policies per resource.
- Avoid duplicate requests across dashboard widgets.
- Keep chart datasets bounded to the requested reporting window.

## Testing and CI

The current `package.json` exposes development, build, preview, and typecheck scripts, but does not currently define a dedicated unit-test or end-to-end-test script. fileciteturn4file0L2-L2

Before production release, add automated coverage for at least:

- Authentication state transitions
- Seller/tenant isolation
- RLS policies
- Dashboard aggregation boundaries
- Product CRUD validation
- Order status transitions
- Return workflows
- Payout calculations
- Permission/role boundaries
- Empty, loading, and error states

CI should run typechecking, tests, and production builds on every pull request.

## Deployment checklist

- [ ] Configure production Supabase project
- [ ] Apply and verify database schema/migrations
- [ ] Enable and test RLS for all exposed tables
- [ ] Verify seller-to-profile ownership constraints
- [ ] Configure production `VITE_SUPABASE_URL`
- [ ] Configure production `VITE_SUPABASE_ANON_KEY`
- [ ] Confirm no service-role secrets are exposed to Vite
- [ ] Run `npm run typecheck`
- [ ] Run automated tests
- [ ] Run `npm run build`
- [ ] Verify authentication redirects
- [ ] Verify cross-seller access is denied
- [ ] Verify empty/loading/error states
- [ ] Verify production database indexes and query plans
- [ ] Configure application monitoring

## Contributing

1. Create a focused branch.
2. Keep TypeScript strict and preserve existing type safety.
3. Keep database access seller-scoped.
4. Treat RLS as part of every data-model change.
5. Run typechecking and the production build before submitting a PR.
6. Add regression tests for security-sensitive or business-critical changes.
7. Prefer small, reviewable commits.

## License

MIT License. See [LICENSE](./LICENSE).
