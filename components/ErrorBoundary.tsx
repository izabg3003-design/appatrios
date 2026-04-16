
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AtriosWork Critical Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isFetchError = this.state.error?.message?.includes('fetch') || 
                          this.state.error?.message?.includes('NetworkError') ||
                          this.state.error?.message?.includes('failed to fetch');

      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-2xl border border-red-500/20 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Oops! Algo correu mal</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                {isFetchError 
                  ? "Parece haver um problema de ligação. Verifique a sua internet ou se o serviço está disponível."
                  : "Ocorreu um erro inesperado no processamento da aplicação."}
              </p>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Detalhes Técnicos</p>
              <p className="text-[11px] font-mono text-slate-400 break-all leading-tight">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-purple-900/20 text-xs uppercase tracking-widest"
              >
                <RefreshCw className="w-4 h-4" /> Recarregar App
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 text-xs uppercase tracking-widest"
              >
                <Home className="w-4 h-4" /> Voltar ao Início
              </button>
            </div>

            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">AtriosWork Resilience Protocol</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
