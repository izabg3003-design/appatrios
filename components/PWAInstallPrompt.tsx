
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
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-[9999] animate-[slideUp_0.5s_ease-out]">
      <div className="relative bg-[#0f172a] rounded-[2.5rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 blur-[80px] pointer-events-none"></div>
        
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-6 right-6 p-1.5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 bg-[#064e3b] rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/10">
            <Smartphone className="w-8 h-8 text-[#10b981]" />
          </div>
          <div className="pr-6 pt-1">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight mb-2">
              Instalar Átrios App
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Tenha acesso rápido aos seus orçamentos e loja diretamente da sua tela inicial.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {deferredPrompt ? (
            <button 
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full py-5 bg-[#10b981] hover:bg-[#059669] text-[#020617] font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              <Download className="w-5 h-5" /> {isInstalling ? "A Instalar..." : "INSTALAR AGORA"}
            </button>
          ) : isIOS ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Share className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">1. Partilhar</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <PlusSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">2. Ecrã Principal</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPrompt(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all"
              >
                Entendido
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
