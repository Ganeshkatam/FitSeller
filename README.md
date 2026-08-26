# FitSeller

FitSeller is a seller-facing ecommerce dashboard built with React, TypeScript, Vite, and Supabase. It provides authenticated sellers with visibility into products, orders, returns, payouts, analytics, and seller performance.

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack React Query
- Supabase Auth and Postgres
- Recharts
- Tailwind CSS
- Radix UI / shadcn-style components
- Lucide React

## Features

- Supabase authentication with persistent sessions
- Seller-aware application routing
- Dashboard with earnings, sales, offers, returns, and try-on metrics
- Earnings trend visualization for the previous 14 days
- Recent sales and top-performing products
- Product management
- Order management
- Returns management
- Payouts
- Analytics
- Seller settings
- Lazy-loaded application pages for improved initial loading performance

## Project structure

```text
src/
├── components/
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Application shell and page layout
│   └── ui/              # Shared UI primitives
├── contexts/
│   └── AuthContext.tsx  # Supabase authentication and seller context
├── lib/
│   ├── offers.ts        # Offer-related helpers
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Shared utilities
├── pages/
│   ├── Analytics.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Orders.tsx
│   ├── Payouts.tsx
│   ├── Products.tsx
│   ├── Returns.tsx
│   └── Settings.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Requirements

- Node.js 20+
- A Supabase project
- Supabase Auth configured for email/password authentication

## Environment variables

Create a local `.env` file from `.env.example` and provide the public Supabase configuration:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The frontend uses the Supabase anonymous/public key. Database authorization must therefore be enforced with PostgreSQL Row Level Security (RLS) policies; client-side filtering is not an authorization boundary.

## Installation

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

## Type checking

```bash
npm run typecheck
```

## Production build

The build performs a TypeScript check before generating the Vite production bundle:

```bash
npm run build
```

Preview the production bundle locally with:

```bash
npm run preview
```

## Authentication and seller context

FitSeller authenticates users through Supabase Auth. After a session is established, the application loads the corresponding profile and seller records before rendering seller-specific dashboard data.

Seller ownership should be represented by stable relational identifiers such as `profile_id`. Email-based matching should only be treated as a migration or recovery mechanism, not as the primary authorization boundary.

## Data security

Because the application talks directly to Supabase from the browser, production deployments should enforce all tenant isolation in the database layer.

Recommended controls include:

- Enable RLS on every application table exposed through the client.
- Restrict seller-owned rows using the authenticated user identity and seller/profile relationship.
- Never trust a `seller_id` supplied by the browser for authorization.
- Keep service-role credentials out of frontend environment variables.
- Return only the columns required by each screen.
- Add indexes for common seller-scoped filters such as `seller_id`, `profile_id`, and timestamp fields.

## Performance notes

Dashboard reporting should remain bounded as data volume grows. Large historical datasets should not be downloaded to the browser solely to calculate totals. Prefer indexed SQL views, RPC functions, or pre-aggregated reporting tables for production-scale reporting.

Application pages are lazy-loaded with React `lazy`/`Suspense`, and TanStack React Query is used to cache server state.

## Current application routes

| Route | Purpose |
| --- | --- |
| `/` | Seller dashboard |
| `/products` | Product management |
| `/orders` | Order management |
| `/returns` | Returns management |
| `/payouts` | Seller payouts |
| `/analytics` | Performance analytics |
| `/settings` | Seller settings |

## Contributing

1. Create a focused branch for the change.
2. Keep TypeScript strict and preserve existing type safety.
3. Run `npm run typecheck` and `npm run build` before opening a pull request.
4. For database changes, verify RLS policies and seller-tenant isolation as part of the change.
5. Prefer small, reviewable commits with clear messages.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
