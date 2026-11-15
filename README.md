# UTM Smart Stay

Centralized university student accommodation marketplace, housing management portal, and system administration console for Universiti Teknologi Malaysia (UTM) across Johor Bahru, Kuala Lumpur, and Pagoh campuses.

## Three Distinct Sites

1. **Student Marketplace (`/`)** — Student-only accommodation search, campus POI map, room-level booking with 15-minute hold, waitlist, roommate & carpool community board, and housing messages.
2. **Housing Management Portal (`/admin`)** — HEPA & residential college staff portal for occupancy analytics, floor-by-floor room toggles, bulk room generation, rate updates, reservation management, and waitlist offers.
3. **System Administrator Console (`/sysadmin`)** — Privileged dark console for inspecting raw database tables, running concurrency lock tests, reviewing audit logs, exporting CSV/JSON snapshots, and resetting seed data.

## Quick Start

```bash
npm install
npm run dev
```

## Build & Package

```bash
npm run lint
npm run build
```

Production assets (including PWA service worker and `404.html` SPA fallback) are output to `dist/`. See `DEPLOYMENT.md` for Vercel and GitHub Pages instructions.
