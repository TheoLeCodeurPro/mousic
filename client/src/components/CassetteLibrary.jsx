import React from 'react';
import { Disc3, Clock } from 'lucide-react';

export default function CassetteLibrary({
  tracks = [],
  currentIndex = 0,
  onSelectTrack,
}) {
  return (
    <div className="relative brushed-aluminum p-3 rounded-lg border-2 border-stone-500 shadow-xl flex flex-col h-full overflow-hidden select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw z-20" />
      <div className="absolute top-2 right-2 hi-fi-screw z-20" />
      <div className="absolute bottom-2 left-2 hi-fi-screw z-20" />
      <div className="absolute bottom-2 right-2 hi-fi-screw z-20" />

      {/* Module Title Header */}
      <div className="flex justify-between items-center mb-2 px-4 z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs tracking-wider text-stone-800">CR-25</span>
          <span className="text-[10px] tracking-widest font-semibold text-stone-600 uppercase">
            CASSETTE TAPE ARCHIVE · HISTORIQUE ({tracks.length} CASSETTES)
          </span>
        </div>
        <div className="text-[9px] font-mono tracking-widest text-stone-600 bg-stone-300 px-2 py-0.5 rounded border border-stone-400">
          DÉFILEZ & CLIQUEZ POUR CHARGER
        </div>
      </div>

      {/* Scrollable Cassette Showcase */}
      <div className="relative flex-1 bg-[#14120f] rounded-lg border-2 border-stone-700 shadow-inner p-3 overflow-y-auto space-y-3 custom-scrollbar z-10">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-500 font-mono text-xs">
            <Disc3 className="w-8 h-8 text-stone-600 mb-2 animate-spin" />
            <span>Chargement des cassettes...</span>
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isSelected = idx === currentIndex;
            const isLive = track.nowPlaying;

            return (
              <div
                key={track.id || idx}
                onClick={() => onSelectTrack(idx)}
                className={`group relative rounded-xl border-3 transition-all duration-200 cursor-pointer p-3 shadow-lg ${
                  isSelected
                    ? 'bg-[#29241e] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-[1.01]'
                    : 'bg-[#1e1b17] border-stone-700 hover:border-stone-500 hover:bg-[#23201a]'
                }`}
              >
                {/* Vintage Cassette Header Label (Paper tape sticker) */}
                <div className="bg-[#ede7da] border border-stone-400 rounded-md px-3 py-1 mb-2 shadow-xs flex items-center justify-between">
                  <div className="flex-1 truncate mr-3">
                    <div className="text-xs font-black text-stone-900 truncate tracking-tight uppercase">
                      {track.name}
                    </div>
                    <div className="text-[11px] font-bold text-stone-700 truncate">
                      {track.artist}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[8px] font-mono font-bold bg-amber-800 text-white px-1.5 py-0.5 rounded">
                      SIDE A
                    </span>
                    <span className="text-[9px] font-mono font-bold text-stone-600">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Cassette Center Face: Large Album Art + Realistic Tape Spools */}
                <div className="relative w-full h-28 bg-[#110f0c] rounded-lg border-2 border-stone-800 p-2 flex items-center justify-between overflow-hidden">
                  {/* Left Spool */}
                  <div className="w-14 h-14 rounded-full border-2 border-stone-600 bg-[#2b2721] flex items-center justify-center flex-shrink-0 shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-stone-300 border border-stone-700 flex items-center justify-center">
                      <div className="w-1.5 h-3.5 bg-stone-800 rounded-xs" />
                    </div>
                  </div>

                  {/* Center: Prominent Large Album Cover */}
                  <div className="relative flex items-center gap-3 bg-[#1c1915] border border-stone-700 rounded-lg p-1.5 shadow-md flex-1 mx-3 max-w-[280px]">
                    {/* Enlarged Album Cover */}
                    <div className="w-20 h-20 rounded bg-stone-900 border border-stone-600 flex-shrink-0 overflow-hidden shadow-md flex items-center justify-center">
                      {track.coverUrl ? (
                        <img
                          src={track.coverUrl}
                          alt={track.album}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Disc3 className="w-10 h-10 text-stone-600" />
                      )}
                    </div>

                    {/* Album info & Time */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                        {isLive ? '🔴 LIVE ON AIR' : 'ALBUM ARCHIVE'}
                      </div>
                      <div className="text-xs font-bold text-stone-200 truncate mt-0.5">
                        {track.album || 'Single'}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-stone-400 font-mono mt-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="truncate">{isLive ? 'En ce moment' : track.date || 'Récemment'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Spool */}
                  <div className="w-14 h-14 rounded-full border-2 border-stone-600 bg-[#2b2721] flex items-center justify-center flex-shrink-0 shadow-inner">
                    <div className="w-5 h-5 rounded-full bg-stone-300 border border-stone-700 flex items-center justify-center">
                      <div className="w-1.5 h-3.5 bg-stone-800 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Cassette Footer Strip: Status & Specs */}
                <div className="flex justify-between items-center text-[8px] text-stone-400 font-mono px-2 pt-2">
                  <span>HIGH BIAS 70µs EQ · JAPAN</span>
                  {isSelected ? (
                    <span className="text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600">
                      ▶ CHARGÉE DANS LA PLATINE TC-90
                    </span>
                  ) : (
                    <span className="text-stone-500 group-hover:text-stone-300">
                      CLIQUEZ POUR LIRE
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Lip */}
      <div className="flex justify-between items-center text-[8px] text-stone-500 font-mono px-4 pt-1 z-10 flex-shrink-0">
        <span>COLLECTION MILES & TRACKS</span>
        <span>DOLBY SURROUND READY</span>
      </div>
    </div>
  );
}
