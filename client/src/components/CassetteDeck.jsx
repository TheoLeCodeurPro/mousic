import React from 'react';
import { Play, Pause, FastForward, Rewind, Disc3 } from 'lucide-react';

export default function CassetteDeck({
  currentTrack,
  isPlaying,
  onPlayToggle,
  onNextTrack,
  onPrevTrack,
  tapeCounter = '042',
}) {
  return (
    <div className="relative brushed-aluminum p-3 rounded-lg border-2 border-stone-500 shadow-xl flex flex-col justify-between h-full select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Model & Branding Header */}
      <div className="flex justify-between items-center px-4 flex-shrink-0">
        <div className="flex items-baseline gap-2">
          <span className="font-hardware font-black text-sm tracking-wider text-stone-900">TC-90</span>
          <span className="text-[10px] tracking-widest font-hardware font-bold text-stone-700 uppercase">
            STEREO CASSETTE TAPE DECK
          </span>
          <span className="text-[8px] tracking-wider px-1 py-0.2 bg-stone-300 font-hifi text-stone-800 rounded border border-stone-400">
            AUTO REVERSE
          </span>
        </div>

        {/* Tape Counter */}
        <div className="flex items-center gap-1.5 bg-[#181512] px-2.5 py-0.5 rounded border border-stone-600">
          <span className="text-[9px] text-amber-500/80 font-hifi tracking-widest">TAPE</span>
          <span className="text-sm font-digital text-amber-400 tracking-widest leading-none">
            {tapeCounter}
          </span>
        </div>
      </div>

      {/* Cassette Well and Transport Area */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-around px-2 my-auto">
        {/* The Cassette Door / Well */}
        <div className="relative w-full max-w-[340px] h-[135px] bg-[#161412] rounded-lg border-3 border-stone-500 shadow-inner p-2 flex flex-col justify-between overflow-hidden">
          {/* Acrylic Backlight glow */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-amber-500/20" />

          {/* The Physical Vintage Cassette */}
          <div className="relative w-full h-full bg-[#24211d] rounded border-2 border-stone-700 shadow-md flex flex-col justify-between p-2">
            {/* Top Label with Track Info */}
            <div className="bg-[#ede7da] border border-stone-400 rounded px-2.5 py-1 shadow-sm flex items-center justify-between">
              <div className="flex-1 truncate mr-2">
                <div className="font-marker text-xs text-stone-900 truncate tracking-wide">
                  {currentTrack ? currentTrack.name : 'AUCUNE CASSETTE CHARGÉE'}
                </div>
                <div className="font-marker text-[10px] text-stone-700 truncate opacity-90">
                  {currentTrack ? currentTrack.artist : 'Sélectionnez une cassette à droite'}
                </div>
              </div>
              <span className="text-[8px] font-hifi font-bold bg-amber-800 text-white px-1.5 py-0.5 rounded">
                SIDE A
              </span>
            </div>

            {/* Center: The Two Tape Spools & Viewing Window */}
            <div className="relative w-full h-[60px] bg-[#11100e] rounded border border-stone-700 flex items-center justify-around px-4">
              {/* Left Spool */}
              <div
                className={`w-10 h-10 rounded-full border-2 border-stone-500 bg-[#35312a] flex items-center justify-center ${
                  isPlaying ? 'spinning' : ''
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-stone-200 border border-stone-600 flex items-center justify-center">
                  <div className="w-1 h-2.5 bg-stone-700 rounded-sm" />
                </div>
              </div>

              {/* Center Window with Album Art Sticker & Tape View */}
              <div className="flex flex-col items-center justify-center w-28 h-11 bg-[#1d1a16] border border-stone-600 rounded px-1 relative overflow-hidden">
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.album}
                    className="w-7 h-7 rounded-sm object-cover border border-amber-900/50 shadow-sm"
                  />
                ) : (
                  <Disc3 className="w-6 h-6 text-amber-600/70" />
                )}
                <span className="text-[7px] text-amber-300 font-hifi tracking-tighter truncate max-w-[95px]">
                  {currentTrack?.album || 'LAST.FM MIX'}
                </span>
                {currentTrack?.nowPlaying && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>

              {/* Right Spool */}
              <div
                className={`w-10 h-10 rounded-full border-2 border-stone-500 bg-[#35312a] flex items-center justify-center ${
                  isPlaying ? 'spinning' : ''
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-stone-200 border border-stone-600 flex items-center justify-center">
                  <div className="w-1 h-2.5 bg-stone-700 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Bottom Cassette Cutout */}
            <div className="flex justify-between items-center text-[7px] text-stone-500 font-hifi px-1">
              <span>TYPE I [NORMAL] 120µs</span>
              <span>JAPAN</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Piano-Key Mechanical Buttons ONLY */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <span className="text-[8px] font-hardware font-bold text-stone-600 uppercase tracking-wider">TRANSPORT</span>
          <div className="flex items-center gap-2">
            {/* REWIND (Previous Track) */}
            <button
              onClick={onPrevTrack}
              title="Cassette précédente"
              className="mech-button flex flex-col items-center justify-center w-11 h-14 rounded cursor-pointer active:translate-y-0.5"
            >
              <Rewind className="w-4 h-4 text-stone-800" />
              <span className="text-[8px] font-hardware font-bold text-stone-800 mt-1">REW</span>
            </button>

            {/* PLAY */}
            <button
              onClick={onPlayToggle}
              title="Lecture"
              className={`mech-button flex flex-col items-center justify-center w-11 h-14 rounded cursor-pointer ${
                isPlaying ? 'active' : ''
              }`}
            >
              <Play className={`w-4 h-4 ${isPlaying ? 'text-green-700 fill-green-700' : 'text-stone-800'}`} />
              <span className="text-[8px] font-hardware font-bold text-stone-800 mt-1">PLAY</span>
            </button>

            {/* PAUSE */}
            <button
              onClick={onPlayToggle}
              title="Pause"
              className={`mech-button flex flex-col items-center justify-center w-11 h-14 rounded cursor-pointer ${
                !isPlaying ? 'active' : ''
              }`}
            >
              <Pause className="w-4 h-4 text-stone-800" />
              <span className="text-[8px] font-hardware font-bold text-stone-800 mt-1">PAUSE</span>
            </button>

            {/* FAST FORWARD (Next Track) */}
            <button
              onClick={onNextTrack}
              title="Cassette suivante"
              className="mech-button flex flex-col items-center justify-center w-11 h-14 rounded cursor-pointer active:translate-y-0.5"
            >
              <FastForward className="w-4 h-4 text-stone-800" />
              <span className="text-[8px] font-hardware font-bold text-stone-800 mt-1">FFWD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[8px] text-stone-500 font-hifi px-4 flex-shrink-0">
        <span>PRECISION DUAL-MOTOR MECHANISM</span>
        <span>DOLBY B/C NOISE REDUCTION</span>
      </div>
    </div>
  );
}
