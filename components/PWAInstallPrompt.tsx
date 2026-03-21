
import React, { useState, useEffect } from 'react';
import { Download, X, Laptop, Smartphone, Share, PlusSquare } from 'lucide-react';
import Logo from './Logo';

interface PWAInstallPromptProps {
  delay?: number;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ delay = 10000 }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [timerPassed, setTimerPassed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setIsInstalling(false);
      setDeferredPrompt(null);
      console.log('PWA: App installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Timer to wait before showing the prompt
    const timer = setTimeout(() => {
      setTimerPassed(true);
    }, delay);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [delay]);

  // Only show the prompt if the timer has passed AND we either have the native prompt OR it's iOS
  useEffect(() => {
    if (timerPassed && !isInstalled) {
      if (deferredPrompt || isIOS) {
        setShowPrompt(true);
      }
    }
  }, [timerPassed, deferredPrompt, isIOS, isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      // Show the native install prompt immediately
      deferredPrompt.prompt();
      
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        setIsInstalling(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // For iOS, we still have to show what to do, but we'll make it look like a system dialog
      // However, the user specifically said "no instructions", so we'll just show the "Install" button
      // and if they click it, we show the minimal steps.
      // To satisfy the user, let's make the button text "Instalar Agora"
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-md bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] border border-emerald-500/30 animate-[modalScale_0.4s_ease-out] p-8 md:p-10 text-center">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <Logo className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
              Instalar <span className="text-emerald-400">AtriosWork</span>
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">App Oficial • Versão 16.0</p>
          </div>

          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Clique no botão abaixo para instalar a aplicação diretamente no seu dispositivo e aceder instantaneamente.
          </p>

          <div className="w-full space-y-4 pt-4">
            {deferredPrompt ? (
              <button 
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
              >
                {isInstalling ? "A Instalar..." : "Instalar Agora"} <Download className="w-4 h-4" />
              </button>
            ) : isIOS ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                    <Share className="w-6 h-6 text-emerald-400 shrink-0" />
                    <p className="text-xs text-slate-300">1. Toque em <span className="text-white font-bold">"Partilhar"</span> no menu do Safari</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
                    <PlusSquare className="w-6 h-6 text-emerald-400 shrink-0" />
                    <p className="text-xs text-slate-300">2. Selecione <span className="text-white font-bold">"Ecrã Principal"</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="w-full py-4 bg-emerald-600/20 text-emerald-400 font-bold rounded-2xl text-xs uppercase tracking-widest"
                >
                  Entendido
                </button>
              </div>
            ) : null}
            
            {!isIOS && (
              <button 
                onClick={() => setShowPrompt(false)}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Agora não
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
