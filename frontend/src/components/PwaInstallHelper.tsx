import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle, X, MoreVertical, Sparkles } from 'lucide-react';

interface PwaInstallHelperProps {
  isDark: boolean;
}

export const PwaInstallButton: React.FC<PwaInstallHelperProps> = ({ isDark }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone / installed PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture beforeinstallprompt event (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Dynamically hide button if already running in standalone PWA window
  if (isStandalone) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        // Trigger native Chromium / Android install prompt
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowInstallModal(true);
      }
    } else {
      // If native event is in cooldown after uninstallation or on iOS, display instant visual guide
      setShowInstallModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all bg-gradient-to-r from-blue-600/15 to-indigo-600/15 hover:from-blue-600/25 hover:to-indigo-600/25 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800 cursor-pointer shadow-xs active:scale-95"
        title="Install SlabMaster PWA on your mobile home screen"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Install App</span>
      </button>

      {/* Universal Step-by-Step Installation Modal (Android Chrome & iOS Safari) */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`max-w-md w-full p-5 sm:p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <img src="/icon-192.png" alt="SlabMaster" className="w-8 h-8 rounded-xl shadow-md" />
                <div>
                  <h3 className="font-black text-sm tracking-tight">Install SlabMaster App</h3>
                  <p className="text-[10px] text-slate-500 font-semibold">dev.slabmasterapp.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Specific Instructions */}
            {isIos ? (
              // iOS Safari Instructions
              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <div className="font-bold">Tap the Share icon in Safari</div>
                    <div className="text-slate-500 mt-0.5 flex items-center space-x-1">
                      <span>Look for the</span>
                      <Share className="w-3.5 h-3.5 inline text-blue-500" />
                      <span>icon in the bottom menu.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <div className="font-bold">Tap "Add to Home Screen"</div>
                    <div className="text-slate-500 mt-0.5 flex items-center space-x-1">
                      <span>Scroll and select</span>
                      <PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" />
                      <span className="font-semibold">Add to Home Screen</span>.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Android Chrome / Edge Instructions
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px]">Since the app was recently uninstalled, Chrome requires 1 tap from the browser menu:</span>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <div className="font-bold">Tap the 3 dots menu (⋮) in Chrome</div>
                    <div className="text-slate-500 mt-0.5 flex items-center space-x-1">
                      <span>Located in the top right corner of Chrome.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <div className="font-bold">Tap "Install app" or "Add to Home screen"</div>
                    <div className="text-slate-500 mt-0.5">
                      Chrome will immediately install SlabMaster with the new icon directly on your Android phone!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Understood</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};