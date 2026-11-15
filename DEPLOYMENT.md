# UTM Smart Stay — Packaging & Deployment Guide

UTM Smart Stay is a Progressive Web App (PWA) with three role-separated portals built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## 1. Site Architecture (Three Separated Portals)

| Portal | Route | Audience | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Student Marketplace** | `/` (or `#/`) | Main Users (Students) | Search & filter residences, campus map, room-level booking (`15-min` hold), waitlist, roommate board, carpool, messaging. Zero admin/database controls. |
| **Housing Management Admin** | `/admin` (or `#/admin`) | HEPA / College Staff | Campus occupancy KPIs, floor-by-floor room status grid, bulk room creation, pricing editor, booking cancel/confirm, waitlist promotion. |
| **System Administrator Console** | `/sysadmin` (or `#/sysadmin`) | System Administrators | Raw database table inspection (`rooms`, `properties`, `users`, `bookings`, `waitlist`), concurrency lock race tests, audit logs, CSV/JSON exports, DB reset. |

### Demo Credentials
- **Student**: `Azraf Mahir` · Matric `A24MJ3028` · Phone `+60123456789` · Simulated OTP `123456`
- **Housing Admin (`/admin`)**: `admin@utm.my` · Passcode `HEPA2026`
- **System Admin (`/sysadmin`)**: `sysadmin@utm-smartstay.internal` · Root Key `SYS-ROOT-2026`

---

## 2. Package for Send-Off (`dist/`)

```bash
# 1. Install dependencies
npm install

# 2. Run typecheck
npm run lint

# 3. Build production bundle + Service Worker into dist/
npm run build
```

The compiled, self-contained static bundle is generated in `dist/`. You can zip `dist/` (or the entire source repository excluding `node_modules/` and `dev-dist/`) to hand off or deploy to any static web host.

To preview the packaged production build locally:
```bash
npm run preview
```

---

## 3. Deploy to Vercel (Recommended)

`vercel.json` is pre-configured with SPA rewrites so `/`, `/admin`, and `/sysadmin` resolve directly to `index.html`, along with PWA headers for `manifest.webmanifest` and `sw.js`.

```bash
npx vercel --prod
```
Or import the GitHub repository in [vercel.com/new](https://vercel.com/new) (Framework Preset: `Vite`, Output Directory: `dist`).

---

## 4. Deploy to GitHub Pages

`public/404.html` handles SPA deep-link redirects for `/admin` and `/sysadmin` on GitHub Pages.

```bash
npm run build
npx gh-pages -d dist
```
If hosting under a repository subpath (`https://<user>.github.io/<repo>/`), set `base: '/<repo>/'` in `vite.config.ts` before building.
