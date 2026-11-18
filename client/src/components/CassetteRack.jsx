import React from 'react';
import { Disc3, Clock, Radio, Music } from 'lucide-react';

export default function CassetteRack({
  tracks = [],
  currentIndex = 0,
  onSelectTrack,
  powerOn,
}) {
  return (
    <div className="bg-[#24201c] border-4 border-[#3d3630] rounded-xl shadow-2xl p-4 flex flex-col h-full max-h-[720px] select-none">
      {/* Rack Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-700 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-stone-200">
              CASSETTE ARCHIVE · HISTORIQUE
            </h2>
            <p className="text-[10px] text-stone-400 font-mono">
              {tracks.length} cassettes récentes scrobblées
            </p>
          </div>
        </div>

        <div className="text-[9px] font-mono text-amber-400/90 bg-stone-900/80 px-2.5 py-1 rounded border border-stone-700">
          CLIQUEZ POUR CHARGER
        </div>
      </div>

      {/* Cassettes List / Rack Shelf */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
        {tracks.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-xs font-mono">
            Aucune cassette trouvée dans les archives.
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isSelected = idx === currentIndex;
            const isLive = track.nowPlaying;

            return (
              <div
                key={track.id || idx}
                onClick={() => onSelectTrack(idx)}
                className={`group relative rounded-lg border p-2 transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#3b342c] border-amber-500 shadow-md translate-x-1'
                    : 'bg-[#1b1815] border-stone-800 hover:border-stone-600 hover:bg-[#201d19]'
                }`}
              >
                {/* Cassette Spine / Side color bar */}
                <div
                  className={`w-1.5 self-stretch rounded-full transition-all ${
                    isLive
                      ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                      : isSelected
                      ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'
                      : 'bg-stone-700 group-hover:bg-stone-500'
                  }`}
                />

                {/* Album Cover Thumbnail */}
                <div className="relative w-11 h-11 rounded bg-stone-900 border border-stone-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={track.album}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Disc3 className="w-6 h-6 text-stone-600" />
                  )}
                  {isLive && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>
                  )}
                </div>

                {/* Cassette Label Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-stone-100 truncate group-hover:text-amber-300">
                      {track.name}
                    </span>
                    {isLive && (
                      <span className="px-1.5 py-0.2 bg-red-600/90 text-white font-mono text-[7px] font-bold rounded uppercase tracking-wider animate-pulse flex-shrink-0">
                        LIVE
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-stone-400 truncate">
                    {track.artist}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-[8px] text-stone-500 font-mono">
                    <span className="truncate max-w-[120px]">{track.album || 'Single'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {isLive ? 'En cours' : track.date || 'Récemment'}
                    </span>
                  </div>
                </div>

                {/* Index badge */}
                <div className="text-[9px] font-mono font-bold text-stone-600 px-1.5">
                  #{String(idx + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rack Footer / Quick Tips */}
      <div className="pt-3 border-t border-stone-800 mt-2 flex justify-between items-center text-[9px] font-mono text-stone-500">
        <span className="flex items-center gap-1">
          <Music className="w-3 h-3 text-amber-500" />
          Synchronisé avec Last.fm
        </span>
        <span>Tape Deck Ready</span>
      </div>
    </div>
  );
}
