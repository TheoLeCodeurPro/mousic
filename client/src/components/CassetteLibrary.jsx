import React from 'react';
import { Disc3 } from 'lucide-react';

const CASSETTE_BRANDS = [
  { name: 'TDK', type: 'D90', color: '#c53030' },
  { name: 'MAXELL', type: 'XLII', color: '#dd6b20' },
  { name: 'SONY', type: 'HF90', color: '#3182ce' },
  { name: 'BASF', type: 'CR-E II', color: '#2b6cb0' },
  { name: 'FUJI', type: 'DR-Ix', color: '#805ad5' },
  { name: 'MEMOREX', type: 'dB', color: '#38a169' },
];

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
            CASSETTE TAPE ARCHIVE · HISTORIQUE ({tracks.length})
          </span>
        </div>
        <div className="text-[8px] font-mono tracking-widest text-stone-500 bg-stone-300 px-2 py-0.5 rounded border border-stone-400">
          SELECT TAPE TO LOAD
        </div>
      </div>

      {/* Rack Interior: Mixtape Cassette Spines Stack (Inspired by 80s/90s tape collection) */}
      <div className="relative flex-1 bg-[#12100d] rounded border-2 border-stone-700 shadow-inner p-2 overflow-y-auto space-y-1.5 custom-scrollbar z-10">
        {tracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-stone-500 font-mono text-xs">
            Aucune cassette dans l'archive.
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isSelected = idx === currentIndex;
            const isLive = track.nowPlaying;
            const brand = CASSETTE_BRANDS[idx % CASSETTE_BRANDS.length];

            return (
              <div
                key={track.id || idx}
                onClick={() => onSelectTrack(idx)}
                className={`group relative h-9 px-2.5 rounded transition-all duration-150 cursor-pointer flex items-center justify-between border shadow-sm ${
                  isSelected
                    ? 'bg-[#f4efe4] border-amber-500 shadow-md scale-[1.01] ring-2 ring-amber-500/70'
                    : 'bg-[#ece5d8] hover:bg-[#faf6ee] border-stone-400'
                }`}
              >
                {/* Left Brand Badge */}
                <div className="flex items-center gap-1.5 flex-shrink-0 w-24 border-r border-stone-300 pr-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: brand.color }}
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-black tracking-tight text-stone-900 font-mono">
                      {brand.name}
                    </span>
                    <span className="text-[7px] font-bold text-stone-500 font-mono">
                      {brand.type}
                    </span>
                  </div>
                </div>

                {/* Center: Handwritten / Mixtape spine style Title & Artist */}
                <div className="flex-1 px-3 min-w-0 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-xs font-black tracking-tight text-stone-900 group-hover:text-blue-900 font-mono mr-2">
                      {track.name}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-700 tracking-normal italic">
                      — {track.artist}
                    </span>
                  </div>
                </div>

                {/* Right: Album thumbnail & Live / Index badge */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={track.album}
                      className="w-6 h-6 rounded-sm object-cover border border-stone-400 shadow-xs"
                      loading="lazy"
                    />
                  ) : (
                    <Disc3 className="w-5 h-5 text-stone-500" />
                  )}

                  {isLive ? (
                    <span className="px-1.5 py-0.5 bg-red-600 text-white font-mono text-[7px] font-black rounded uppercase tracking-wider animate-pulse flex-shrink-0">
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono font-bold text-stone-500 w-5 text-right">
                      #{idx + 1}
                    </span>
                  )}

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b] flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rack Bottom Lip */}
      <div className="flex justify-between items-center text-[8px] text-stone-500 font-mono px-4 pt-1 z-10 flex-shrink-0">
        <span>JAPAN PRECISION CASSETTE STORAGE</span>
        <span>DOLBY B/C NR EQUIPPED</span>
      </div>
    </div>
  );
}
