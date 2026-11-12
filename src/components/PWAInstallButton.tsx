import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'sidebar';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed standalone PWA, show a subtle badge in sidebar or hide in compact header
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Running as Native App</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          style={{ backgroundColor: '#800000' }}
        >
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-red-200 shrink-0" />
            <span>{isIOS ? 'Install on iPhone / iPad' : 'Install Native Web App'}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">PWA</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-95 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          style={{ backgroundColor: '#800000' }}
          title="Install UTM Smart Stay as a native app on your device"
        >
          <Download className="w-3.5 h-3.5 text-red-200" />
          <span>Install App</span>
        </button>
      )}

      {/* Guided Installation Modal (for iOS Safari or preview iframe environments) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowGuideModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm shrink-0"
                  style={{ backgroundColor: '#800000' }}
                >
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Install UTM Smart Stay
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add to your Home Screen or Desktop for offline access
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {/* iOS Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#800000]" />
                  <span>iPhone &amp; iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>
                    Open this app directly in <strong>Safari</strong> (outside any preview frame).
                  </li>
                  <li>
                    Tap the <strong>Share</strong> icon{' '}
                    <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> in the bottom toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
                  </li>
                </ol>
              </div>

              {/* Android & Desktop Chrome/Edge Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-[#800000]" />
                  <span>Desktop (Chrome / Edge) &amp; Android</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>
                    Open the deployed app URL in a direct browser tab (browsers block install prompts inside embedded preview iframes).
                  </li>
                  <li>
                    Click the <strong>Install App</strong> icon in the address bar or click this button again to launch the native OS installer.
                  </li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-95 transition-opacity"
              style={{ backgroundColor: '#800000' }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
