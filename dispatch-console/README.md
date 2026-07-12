# Dispatch Console

Frontend for the Logsprey / Raven / Pigeon backend, built for the e-commerce/orders hackathon track.

## Stack

- **Vite + React + TypeScript**
- **React Router** for navigation
- **TanStack Query** for server state (caching, refetch, mutations)
- **Axios** for HTTP
- **Tailwind CSS** for styling

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`, using **mock data by default** — no backends need to be
running. Every screen is fully interactive against an in-memory dataset (create/edit/delete
persist for the session, reset on page reload).

When your real backends are up, open `.env`, set `VITE_USE_MOCKS=false`, point the three
URLs at your services, and restart `npm run dev`. No code changes needed — same API client
files, same components.

## Backend mapping

| Screen | Backend | Notes |
|---|---|---|
| Dashboard | Logsprey + Raven + Orders | Pulls a summary from all three |
| Orders | **Orders API (not in your docs — assumed shape)** | Swap `src/lib/api/orders.ts` for your real service |
| Activity Log | Logsprey | `/api/storage/logs*` |
| Automations | Raven | `/api/automations*` — includes a condition builder that compiles to the postfix `instructions` format Raven expects |
| Reports | Logsprey | `/api/storage/logs/stats*` |
| Settings | — | Shows which API URLs are configured |

Pigeon has no direct frontend surface (it's invoked internally by Raven actions), so there's no dedicated screen for it.

## Structure

```
src/
  lib/
    api/          # one Axios client per backend service
    types.ts      # mirrors the schemas in your README docs exactly
  components/
    layout/       # Sidebar, Topbar, page shell
    ui/           # Card, Button, Badge, EmptyState
  pages/          # one folder/file per screen, wired to routes in App.tsx
```

## Design direction

Both Raven and Pigeon are named for message-carrying birds, and the domain is order
fulfillment — so the UI leans into a **dispatch office / shipping manifest** motif rather
than a generic admin template: perforated "manifest stub" cards, a postal color
palette (ink navy, parchment, stamp red, dispatch amber), Fraunces for display type,
IBM Plex Mono for IDs/timestamps/trace data.

## Known gaps to fill in

- **Mock data resets on reload**: it's an in-memory store (`src/lib/mocks/data.ts`), not
  persisted anywhere. That's intentional for a hackathon demo — swap to live backends
  when you need durability.
- **Orders API**: currently points at an assumed REST shape (`GET/POST /api/orders`,
  `PATCH /api/orders/:id/status`). Update `src/lib/api/orders.ts` once your real
  service exists — no other file needs to change.
- **Auth**: none wired up yet — add an interceptor in `src/lib/api/client.ts` once
  you have a token strategy.
- **Automation condition builder**: supports flat `AND`/`OR` chains (the common
  case). Nested/mixed boolean logic isn't exposed in the UI — edit those
  automations via the API directly, or extend `AutomationEditor.tsx`.
- **New order form**: the "New order" button on the Orders page is currently a
  placeholder — wire it to `ordersApi.create` once you've settled the order-creation
  UX (single item vs. cart-style multi-item entry).
