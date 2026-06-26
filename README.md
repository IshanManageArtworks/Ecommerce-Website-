# ShopAdmin

A React + Redux Toolkit + RTK Query e-commerce admin dashboard, backed by a
small zero-dependency mock REST server.

## Tech stack

- **React 18** with **Vite** (dev server + build)
- **Redux Toolkit** for state, **RTK Query** for data fetching/caching
- **react-router-dom v7** for routing
- **redux-persist** to keep auth/cart/wishlist/theme/ui state across reloads
- **Tailwind CSS v4** (CSS-based config, no `tailwind.config.js`) for styling
- Plain emoji for icons — no icon library dependency

No TypeScript, no UI component library, no backend framework. The "backend"
is a single Node script with no `npm install` step of its own.

## Project structure

```
frontend/
  src/
    app/store.js          Redux store: persisted reducers + RTK Query middleware
    services/
      api.js               Base RTK Query instance (baseUrl, auth header, 401 → logout)
      authApi.js            login / register
      productsApi.js         products, categories, cart, orders, reviews, users…
    features/                Redux slices: auth, cart, wishlist, theme, ui, notification
    components/
      layout/                Navbar, Sidebar, Layout (offline banner + routing outlet)
      product/                ProductCard, ProductGrid, SearchBar, filters, pagination
      ui/                     Button, Input, EmptyState, skeleton loaders
      error/                  ErrorBoundary
    pages/                   One file per route (see Routes below)
    router/                  AppRouter (route table), ProtectedRoute (auth guard)
    hooks/                   useDebounce, useInfiniteScroll, usePagination, etc.

server.js                 Mock REST API (reads/writes db.json)
db.json                   Mock data: users, products, carts, orders, reviews, notifications
```

## Running it

You need two things running at once: the mock API server, and the Vite dev server.

**1. Mock API server** (no install required — uses only Node's built-in `http`/`fs`):

```bash
node server.js
# Mock API server running at http://localhost:4000
```

Pass `--port` / `--db` to change the port or data file:
```bash
node server.js --port 4000 --db db.json
```

The frontend's RTK Query base URL is hardcoded to `http://localhost:4000` in
`src/services/api.js` — if you change the port, update that file too.

**2. Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) and log in
with any user from `db.json` (e.g. `user1@example.com` / `123456`), or use
the **Sign up** link to register a new account.

Other scripts: `npm run build` (production build), `npm run preview`
(preview that build), `npm run lint` (ESLint).

## Routes

| Path | Page | Notes |
|---|---|---|
| `/login`, `/` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Protected. Live stats from products/orders/users |
| `/products` | Products | Protected. Search, category filter, price filter, sort, pagination |
| `/products/:id` | Product details | Protected |
| `/cart` | Cart | Protected |
| `/wishlist` | Wishlist | Protected |
| `/notifications` | Notifications | Protected. Infinite scroll (mock-generated) |
| `/profile` | Profile | Protected. Polls `/users/:id` every 15s |

Protected routes redirect to `/login` if not authenticated
(`src/router/ProtectedRoute.jsx`). Session expiry is mocked: login sets a
10-minute `expiresAt`, and `App.jsx` checks it every 5 seconds and logs out
automatically when it passes.

## What's real vs. decorative

Everything reading product/user/cart/order/review data is wired to the mock
server and persists to `db.json` on writes. A few UI elements from the
original design reference don't have backend support behind them yet and are
intentionally inert (visible, but disabled or non-functional) rather than
faked with made-up data:

- **Login page:** "Remember me" is local UI state only (session persistence
  already happens via redux-persist regardless); "Forgot password?" and
  "Sign in with SSO" are disabled with a tooltip explaining why.
- **Product details:** color swatches, the extra thumbnail strip, SKU, and
  the "Customer Reviews" / "Shipping & Returns" tabs are static — the
  product data model doesn't include variants, multiple images, or reviews
  per product.
- **Cart page:** the discount-code field doesn't apply any discount;
  shipping is always shown as free; tax is a flat illustrative 8%, not a
  real calculation; "Proceed to Checkout" is disabled (no checkout flow
  exists).

Each of these is commented in the relevant source file.

## Mock server notes

`server.js` is a small REST server: any array in `db.json` (e.g. `products`,
`users`, `carts`, `orders`, `reviews`, `notifications`) automatically gets
`GET` (list + filter + paginate via `?limit=&skip=`), `GET /:id`, `POST`,
`PUT /:id`, `PATCH /:id`, and `DELETE /:id`. A few routes are hand-written on
top for things the generic CRUD can't express: `/auth/login`,
`/auth/register`, `/products/search`, `/products/category/:slug`,
`/categories`, and `/carts/user/:id`.

Data written through the API (new users from registration, cart/wishlist
actions that hit `POST /carts`, etc.) is persisted back to `db.json` on disk,
so restarting the server keeps your changes — delete/restore `db.json` from
version control if you want a clean slate.
