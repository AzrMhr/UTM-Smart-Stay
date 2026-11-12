import React, { useState } from 'react';
import {
  X,
  Rocket,
  Copy,
  Check,
  Terminal,
  Globe,
  Smartphone,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activePlatform, setActivePlatform] = useState<'vercel' | 'ghpages' | 'pwa'>('vercel');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const vercelCliCommands = `# 1. Install dependencies & test production build locally
npm install
npm run build

# 2. Deploy to Vercel (interactive setup + production URL)
npx vercel --prod`;

  const ghPagesCliCommands = `# 1. Install gh-pages deployment utility
npm install -D gh-pages

# 2. Build the Vite + PWA bundle into dist/
npm run build

# 3. Publish dist/ folder to the gh-pages branch
npx gh-pages -d dist`;

  const ghActionsWorkflow = `name: Deploy UTM Smart Stay to GitHub Pages
on:
  push:
    branches: ['main']
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: '#800000' }}
            >
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Deployment &amp; Native PWA Guide
              </h2>
              <p className="text-xs text-slate-500">
                Step-by-step instructions for Vercel, GitHub Pages &amp; Home Screen Installation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200/80 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActivePlatform('vercel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activePlatform === 'vercel'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Deploy to Vercel (Recommended)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('ghpages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activePlatform === 'ghpages'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>2. Deploy to GitHub Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePlatform('pwa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
              activePlatform === 'pwa'
                ? 'bg-[#800000] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>3. Native PWA Checklist</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {activePlatform === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pre-Configured with vercel.json</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  A production <code className="font-mono font-bold">vercel.json</code> file is already included in the root folder to handle SPA rewrites and serve <code className="font-mono">manifest.webmanifest</code> and <code className="font-mono">sw.js</code> with optimal cache headers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Option A: GitHub Integration (Zero-Config CI/CD)
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <li>
                    Push this project to a GitHub repository (e.g., <code className="font-mono text-slate-800">utm-smart-stay</code>).
                  </li>
                  <li>
                    Log in to <strong>vercel.com</strong> and click <strong>Add New ➔ Project</strong>.
                  </li>
                  <li>
                    Import your GitHub repository. Vercel automatically detects <strong>Vite</strong>:
                    <ul className="list-disc list-inside ml-5 mt-1 text-[11px] text-slate-500 font-mono">
                      <li>Build Command: npm run build</li>
                      <li>Output Directory: dist</li>
                    </ul>
                  </li>
                  <li>
                    Click <strong>Deploy</strong>. Your live HTTPS URL will be ready in ~45 seconds!
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#800000]" />
                    <span>Option B: Deploy via Vercel CLI</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => copyText('vercel-cli', vercelCliCommands)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    {copiedId === 'vercel-cli' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {vercelCliCommands}
                </pre>
              </div>
            </div>
          )}

          {activePlatform === 'ghpages' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-[#800000]" />
                    <span>Method 1: Quick Deploy via gh-pages Package</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => copyText('gh-cli', ghPagesCliCommands)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    {copiedId === 'gh-cli' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {ghPagesCliCommands}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Method 2: Automated GitHub Actions (.github/workflows/deploy.yml)
                  </h3>
                  <button
                    type="button"
                    onClick={() => copyText('gh-actions', ghActionsWorkflow)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                  >
                    {copiedId === 'gh-actions' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy YAML</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-600">
                  In GitHub, go to <strong>Settings ➔ Pages ➔ Build and deployment</strong>, select <strong>GitHub Actions</strong>, and add this workflow file:
                </p>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                  {ghActionsWorkflow}
                </pre>
              </div>
            </div>
          )}

          {activePlatform === 'pwa' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Web App Manifest</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Configured with <code className="font-mono">display: &quot;standalone&quot;</code>, <code className="font-mono">short_name: &quot;UTMSmartStay&quot;</code>, and <code className="font-mono">#800000</code> theme color.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Offline Service Worker</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Workbox precaches all JS, CSS, HTML, and SVG/PNG icons plus runtime caches Google Fonts for instant offline startup.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Compliant App Icons</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Includes <code className="font-mono">192x192</code>, <code className="font-mono">512x512</code>, <code className="font-mono">maskable</code>, and iOS <code className="font-mono">apple-touch-icon.png</code>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Desktop &amp; Mobile Adaptive</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Automatically switches between the 4-tab mobile layout and the full multi-column desktop dashboard.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold">Also Saved in Project Repository:</div>
                <p>
                  All deployment commands and configurations are saved in <code className="font-mono font-bold">/DEPLOYMENT.md</code> and <code className="font-mono font-bold">/vercel.json</code> in your project workspace.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Full documentation available in <code className="font-mono font-semibold text-slate-700">DEPLOYMENT.md</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs text-white shadow-xs"
            style={{ backgroundColor: '#800000' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
