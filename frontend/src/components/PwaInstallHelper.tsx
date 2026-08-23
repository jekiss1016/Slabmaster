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

      {/* High-Contrast Installation Modal (Android Chrome & iOS Safari) */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <img src="/icon-192.png" alt="SlabMaster" className="w-9 h-9 rounded-xl shadow-md border border-slate-200 dark:border-slate-700" />
                <div>
                  <h3 className="font-black text-base tracking-tight text-slate-950 dark:text-white">Install SlabMaster App</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">dev.slabmasterapp.com</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Instructions with Ultra High-Contrast Typography */}
            {isIos ? (
              // iOS Safari Instructions
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div className="space-y-1">
                    <div className="font-black text-xs text-slate-950 dark:text-white">Tap the Share icon in Safari</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center space-x-1.5">
                      <span>Look for the</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-bold">
                        <Share className="w-3 h-3 mr-1 inline" /> Share
                      </span>
                      <span>icon at the bottom of Safari.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div className="space-y-1">
                    <div className="font-black text-xs text-slate-950 dark:text-white">Tap "Add to Home Screen"</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center space-x-1.5">
                      <span>Scroll down and tap</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        <PlusSquare className="w-3 h-3 mr-1 inline" /> Add to Home Screen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Android Chrome / Edge Instructions
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-950 dark:text-blue-200 flex items-start space-x-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold leading-snug">
                    Follow these 2 quick steps to install directly from your browser:
                  </span>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                  <div className="space-y-1">
                    <div className="font-black text-xs text-slate-950 dark:text-white">
                      Tap the 3 dots menu (<MoreVertical className="w-3.5 h-3.5 inline text-blue-600 dark:text-blue-400" />) in Chrome
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Located in the top right corner of your Chrome browser screen.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                  <div className="space-y-1">
                    <div className="font-black text-xs text-slate-950 dark:text-white">
                      Tap <span className="underline decoration-blue-500 underline-offset-2">"Install app"</span> or <span className="underline decoration-blue-500 underline-offset-2">"Add to Home screen"</span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Chrome will immediately install SlabMaster with the new icon directly on your phone!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Got It</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};