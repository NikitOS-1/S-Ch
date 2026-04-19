# StripeDemo — educational Next.js + Stripe (test mode)

Educational app that demonstrates **three ways** to accept card payments with [Stripe](https://stripe.com) in **sandbox / test mode** only. No real money is charged.

| Route | Flow | Notes |
|--------|------|--------|
| `/payment-link` | [Payment Links](https://stripe.com/docs/payments/payment-links) | Opens a hosted Stripe page; no Checkout Session API in this demo |
| `/checkout` | [Stripe Checkout](https://stripe.com/docs/payments/checkout) (redirect) | Server creates a Checkout Session; user returns to `/success` |
| `/elements` | [Payment Element](https://stripe.com/docs/payments/payment-element) (embedded) | Server creates a PaymentIntent; card form stays on your site |

**Stack:** Next.js 15 (App Router), TypeScript, Redux Toolkit + RTK Query, Tailwind CSS, Stripe.js / `@stripe/react-stripe-js`, `stripe` (server).

**Architecture:** [Feature-Sliced Design](https://feature-sliced.design/)–style layout under `src/`: `app` (routing + thin API handlers) → `widgets` → `features` → `entities` → `shared`. Imports go **down** the layers only; each slice exposes a public `index.ts`.

---

## Prerequisites

- Node.js 18+ (see Next.js [requirements](https://nextjs.org/docs/getting-started/installation))
- A [Stripe account](https://dashboard.stripe.com/register) in **test mode**

---

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy environment variables and fill in your **test** keys from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys):

```bash
cp .env.example .env.local
```

3. Create a [Payment Link](https://dashboard.stripe.com/test/payment-links) (or use an existing test link) and set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`.

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Secret key (`sk_test_…`). **Server only** — never expose to the client. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Publishable key (`pk_test_…`) for Stripe.js / Elements. |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | Yes for Payment Link page | URL of a Stripe Payment Link (test mode). |
| `NEXT_PUBLIC_URL` | Yes | Absolute origin of the app (e.g. `http://localhost:3000`) — used for Checkout `success_url` / `cancel_url`. |

`.env.local` is gitignored. Use `.env.example` as a template without real secrets.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Node test runner + `tsx`) |

---

## Project structure (`src/`)

```
src/
├── app/                 # Next.js routes, layout, globals.css; API routes delegate to features
├── widgets/             # Page-level composition (header, footer, per-route screens)
├── features/            # User flows + RTK slices + feature APIs
│   ├── checkout-redirect/
│   ├── stripe-elements-form/
│   ├── payment-link-redirect/
│   └── payment-status/
├── entities/            # Domain types + small presentational pieces (e.g. product card)
└── shared/              # Store, base RTK Query API, Stripe helpers, UI primitives, env helpers
```

- **API routes** (`src/app/api/*/route.ts`) only parse requests and call **`features/*/server.ts`** (marked with `server-only`) so secret keys never ship in client bundles.
- **Redux:** one `baseApi` (`shared/api/baseApi.ts`); features add endpoints via `injectEndpoints`. Feature slices: `checkout`, `elements`.

Path alias: `@/*` → `src/*` (see `tsconfig.json`).

---

## Test cards

The sticky banner includes a **Test cards** menu with common [Stripe test numbers](https://stripe.com/docs/testing). Typical success card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## Security notes

- Rotate keys if they are ever committed or leaked.
- For production, add webhooks, idempotent order handling, and never trust the client alone for payment status — verify on the server (this demo focuses on UI flows).

---

## License

Private / educational use unless stated otherwise.
