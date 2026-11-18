import React from 'react';
import { AlertTriangle, RefreshCw, Key, WifiOff } from 'lucide-react';

export default function OfflineBanner({ error, warning, onRetry, isRetrying }) {
  if (!error && !warning) return null;

  const isWarning = !error && Boolean(warning);

  return (
    <div
      className={`mb-4 p-3 rounded-lg border shadow-lg flex items-center justify-between gap-3 text-xs ${
        isWarning
          ? 'bg-amber-950/80 border-amber-600/70 text-amber-200'
          : 'bg-red-950/90 border-red-600/80 text-red-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {isWarning ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-400 flex-shrink-0" />
        )}
        <div>
          <div className="font-bold tracking-wide">
            {isWarning ? 'Diffusion perturbée (Mode Cache Actif)' : 'Signal Last.fm Interrompu'}
          </div>
          <div className="text-[11px] opacity-90">
            {error || warning}
          </div>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-100 font-mono text-[10px] font-bold border border-stone-600 transition-all flex-shrink-0 active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Tentative...' : 'Réessayer'}
        </button>
      )}
    </div>
  );
}
