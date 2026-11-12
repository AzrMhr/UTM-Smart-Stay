# UTM Smart Stay — Deployment & PWA Installation Guide

This project is a **Progressive Web App (PWA)** built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Vite** (`vite-plugin-pwa`). It supports both **Desktop multi-column dashboards** and **Mobile touch screens**, and can be installed directly onto iOS, Android, Windows, and macOS devices.

---

## 1. Local Development & Production Build

### Prerequisites
- **Node.js** `v18.18+` or `v20+`
- **npm** `v9+`

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Start development server (runs on http://localhost:3000)
npm run dev
```

### Build & Preview Production Bundle
```bash
# 1. Compile TypeScript and generate production build + Service Worker (dist/)
npm run build

# 2. Preview production build locally
npm run preview
```

---

## 2. Option A: Deploy to Vercel (Recommended — Zero Config)

Vercel automatically detects Vite applications and serves the generated PWA manifest (`manifest.webmanifest`) and Service Worker (`sw.js`) over HTTPS.

### Method 1: Deploy via GitHub Integration (Automatic CI/CD)
1. Push your project repository to **GitHub**.
2. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. Click **Import** next to your `utm-smart-stay` repository.
4. Verify the build settings (auto-detected):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Within ~45 seconds, your live HTTPS URL (`https://your-project.vercel.app`) will be ready and installable as a native PWA.

### Method 2: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally (or run with npx)
npx vercel

# 2. Deploy directly to production
npx vercel --prod
```
*(Note: The included `vercel.json` automatically configures SPA routing and `Cache-Control` headers for `sw.js` and `manifest.webmanifest`.)*

---

## 3. Option B: Deploy to GitHub Pages

You can host **UTM Smart Stay** for free on **GitHub Pages** using either GitHub Actions (recommended) or the `gh-pages` npm package.

### Step 1: Set Base Path (If deploying to a project subpath)
If your GitHub Pages URL is `https://<username>.github.io/<repo-name>/`, set `base: '/<repo-name>/'` in `vite.config.ts`. If deploying to a custom domain or `<username>.github.io`, keep `base: '/'`.

### Step 2: Automated GitHub Actions Workflow (Recommended)
1. In your GitHub repository, navigate to **Settings ➔ Pages**.
2. Under **Build and deployment ➔ Source**, select **GitHub Actions**.
3. Create `.github/workflows/deploy.yml` with the following configuration:

```yaml
name: Deploy UTM Smart Stay to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build with Vite
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Alternative: Manual Deploy with `gh-pages` CLI
```bash
# 1. Install gh-pages
npm install -D gh-pages

# 2. Build the project
npm run build

# 3. Publish the dist/ folder to the gh-pages branch
npx gh-pages -d dist
```

---

## 4. Installing UTM Smart Stay as a Native App (PWA)

Once deployed over HTTPS (on Vercel, GitHub Pages, or Cloud Run):

- **Desktop (Chrome / Edge / Brave)**:
  Click the **"Install App"** button in the top navigation bar or left sidebar, or click the install icon in your browser's address bar. The app launches in its own standalone window.
- **Android (Chrome)**:
  Tap **"Install App"** in the header or select **"Install app" / "Add to Home screen"** from the browser menu.
- **iOS / iPadOS (Safari)**:
  Tap **"Install App"** in the header to view the iOS guide, or tap the Safari **Share** button and select **"Add to Home Screen"**.
