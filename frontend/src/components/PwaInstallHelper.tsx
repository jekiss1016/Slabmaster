import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle, X } from 'lucide-react';

interface PwaInstallHelperProps {
  isDark: boolean;
}

export const PwaInstallButton: React.FC<PwaInstallHelperProps> = ({ isDark }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosModal, setShowIosModal] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone / installed PWA mode
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

    // Listen for beforeinstallprompt event (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Dynamically hide if already installed or running as standalone app
  if (isStandalone) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger native Android / Chromium install dialog
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      // Show iOS step-by-step visual instructions
      setShowIosModal(true);
    } else {
      // General Desktop / Web install instructions fallback
      setShowIosModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 cursor-pointer font-bold text-xs border border-blue-200 dark:border-blue-800"
        title="Install SlabMaster PWA on your mobile home screen"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>Install App</span>
      </button>

      {/* iOS & Desktop Step-by-Step Installation Modal */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Install SlabMaster on Mobile</h3>
                  <p className="text-[11px] text-slate-500">Fast home screen access & offline field mode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <div className="font-bold">Tap the Share button in Safari / Browser</div>
                  <div className="text-slate-500 mt-0.5 flex items-center space-x-1">
                    <span>Look for the</span>
                    <Share className="w-3.5 h-3.5 inline text-blue-500" />
                    <span>icon at the bottom or top of your browser.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <div className="font-bold">Select "Add to Home Screen"</div>
                  <div className="text-slate-500 mt-0.5 flex items-center space-x-1">
                    <span>Scroll down and tap</span>
                    <PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" />
                    <span className="font-semibold">Add to Home Screen</span>.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <div className="font-bold">Launch from Home Screen</div>
                  <div className="text-slate-500 mt-0.5">SlabMaster opens fullscreen just like a native app with offline job caching!</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
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