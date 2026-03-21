
import React, { useState, useEffect } from 'react';
import { Download, X, Laptop, Smartphone, Share, PlusSquare, ArrowUpCircle } from 'lucide-react';
import Logo from './Logo';

interface PWAInstallPromptProps {
  delay?: number;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ delay = 10000 }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

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

    // Timer to show prompt after specified delay
    // Only if not already installed
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowPrompt(true);
      }
    }, delay);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, delay]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt, show instructions inside the modal
      setShowInstructions(true);
      return;
    }
    
    setIsInstalling(true);
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // The appinstalled event will handle the rest
    } else {
      console.log('User dismissed the install prompt');
      setIsInstalling(false);
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-md bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] border border-emerald-500/30 animate-[modalScale_0.4s_ease-out] p-8 md:p-10">
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
            <Logo className="w-12 h-12" />
          </div>

          {!showInstructions ? (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                  Instalar <span className="text-emerald-400">AtriosWork</span>
                </h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Aceda mais rápido e trabalhe offline</p>
              </div>

              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Instale a nossa aplicação para ter uma experiência profissional completa, com acesso direto do seu ecrã inicial e notificações em tempo real.
              </p>

              <div className="w-full grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Mobile</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Laptop className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Desktop</span>
                </div>
              </div>

              <div className="w-full space-y-4 pt-4">
                <button 
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInstalling ? (
                    <>A Instalar... <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div></>
                  ) : (
                    <>Baixar Aplicação <Download className="w-4 h-4" /></>
                  )}
                </button>
                <button 
                  onClick={() => setShowPrompt(false)}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Talvez mais tarde
                </button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Como Instalar</h2>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Siga estes passos simples</p>
              </div>

              <div className="space-y-4 text-left">
                {isIOS ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Share className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Toque no botão <span className="text-white font-bold">"Partilhar"</span> no menu inferior do Safari.
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <PlusSquare className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Role para baixo e selecione <span className="text-white font-bold">"Adicionar ao Ecrã Principal"</span>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Clique nos <span className="text-white font-bold">três pontos</span> no canto superior direito do navegador.
                      </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Download className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Selecione <span className="text-white font-bold">"Instalar Aplicação"</span> ou "Instalar AtriosWork".
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
