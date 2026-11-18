import React from 'react';
import { Play, Pause, Square, FastForward, Rewind, Disc3 } from 'lucide-react';

export default function CassetteDeck({
  currentTrack,
  isPlaying,
  onPlayToggle,
  onNextTrack,
  onPrevTrack,
  powerOn,
  tapeCounter = '042',
}) {
  return (
    <div className="relative brushed-aluminum p-4 border-b-2 border-stone-400 select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Model & Branding */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-xs tracking-wider text-stone-800">TC-90</span>
          <span className="text-[10px] tracking-widest font-semibold text-stone-600 uppercase">
            STEREO CASSETTE TAPE DECK
          </span>
          <span className="text-[8px] tracking-wider px-1 py-0.2 bg-stone-300 text-stone-700 rounded border border-stone-400">
            AUTO REVERSE
          </span>
        </div>

        {/* Tape Counter & Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#181512] px-2 py-0.5 rounded border border-stone-600">
            <span className="text-[8px] text-amber-500/80 font-mono tracking-widest">TAPE</span>
            <span className="text-xs font-mono font-bold text-amber-400 tracking-widest">
              {tapeCounter}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[8px] text-stone-600 font-bold uppercase">DOLBY B-C NR</span>
            <div className={`w-2 h-2 rounded-full ${powerOn ? 'green-led-on' : 'bg-green-950 opacity-40'}`} />
          </div>
        </div>
      </div>

      {/* Cassette Well and Track Presentation */}
      <div className="flex flex-col md:flex-row gap-4 items-center px-2">
        {/* The Cassette Door / Well */}
        <div className="relative w-full max-w-[370px] h-[145px] bg-[#161412] rounded-lg border-4 border-stone-500 shadow-inner p-2 flex flex-col justify-between overflow-hidden">
          {/* Acrylic Backlight glow */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              powerOn ? 'opacity-30 bg-amber-500/20' : 'opacity-0'
            }`}
          />

          {/* The Physical Vintage Cassette */}
          <div className="relative w-full h-full bg-[#24211d] rounded border-2 border-stone-700 shadow-md flex flex-col justify-between p-2">
            {/* Top Label with Track Info */}
            <div className="bg-[#e7e1d5] border border-stone-400 rounded px-2 py-1 shadow-sm flex items-center justify-between">
              <div className="flex-1 truncate mr-2">
                <div className="text-[10px] font-bold text-stone-900 truncate tracking-tight uppercase">
                  {currentTrack ? currentTrack.name : 'NO CASSETTE INSERTED'}
                </div>
                <div className="text-[9px] font-semibold text-stone-700 truncate">
                  {currentTrack ? currentTrack.artist : 'Insert tape from rack below'}
                </div>
              </div>
              <span className="text-[8px] font-mono font-bold bg-amber-700 text-white px-1 py-0.2 rounded">
                SIDE A
              </span>
            </div>

            {/* Center: The Two Tape Spools & Viewing Window */}
            <div className="relative w-full h-[65px] bg-[#11100e] rounded border border-stone-700 flex items-center justify-around px-4">
              {/* Left Spool */}
              <div
                className={`w-11 h-11 rounded-full border-2 border-stone-500 bg-[#35312a] flex items-center justify-center ${
                  isPlaying && powerOn ? 'spinning' : ''
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-stone-200 border border-stone-600 flex items-center justify-center">
                  <div className="w-1 h-3 bg-stone-700 rounded-sm" />
                </div>
              </div>

              {/* Center Window with Album Art Sticker & Tape View */}
              <div className="flex flex-col items-center justify-center w-28 h-12 bg-[#1d1a16] border border-stone-600 rounded px-1 relative overflow-hidden">
                {currentTrack?.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.album}
                    className="w-8 h-8 rounded-sm object-cover border border-amber-900/50 shadow-sm"
                  />
                ) : (
                  <Disc3 className="w-7 h-7 text-amber-600/70" />
                )}
                <span className="text-[7px] text-amber-300 font-mono tracking-tighter truncate max-w-[100px] mt-0.5">
                  {currentTrack?.album || 'LAST.FM MIX'}
                </span>
                {currentTrack?.nowPlaying && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>

              {/* Right Spool */}
              <div
                className={`w-11 h-11 rounded-full border-2 border-stone-500 bg-[#35312a] flex items-center justify-center ${
                  isPlaying && powerOn ? 'spinning' : ''
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-stone-200 border border-stone-600 flex items-center justify-center">
                  <div className="w-1 h-3 bg-stone-700 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Bottom Cassette Screws & Cutout */}
            <div className="flex justify-between items-center text-[7px] text-stone-500 font-mono px-1">
              <span>TYPE I [NORMAL BIAS] 120µs EQ</span>
              <span>JAPAN</span>
            </div>
          </div>
        </div>

        {/* Right Side: Mechanical Push Buttons & Headphone Jack */}
        <div className="flex flex-col justify-between h-[145px] w-full md:w-auto">
          {/* Mechanical Transport Piano-Key Buttons */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider">TRANSPORT</span>
            <div className="grid grid-cols-5 gap-1.5">
              {/* REWIND (Previous Track) */}
              <button
                onClick={onPrevTrack}
                disabled={!powerOn}
                title="Morceau précédent"
                className="mech-button flex flex-col items-center justify-center w-9 h-11 rounded active:translate-y-0.5"
              >
                <Rewind className="w-3.5 h-3.5 text-stone-800" />
                <span className="text-[7px] font-bold text-stone-700">REW</span>
              </button>

              {/* PLAY */}
              <button
                onClick={onPlayToggle}
                disabled={!powerOn}
                title="Lecture"
                className={`mech-button flex flex-col items-center justify-center w-9 h-11 rounded ${
                  isPlaying ? 'active' : ''
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isPlaying ? 'text-green-700 fill-green-700' : 'text-stone-800'}`} />
                <span className="text-[7px] font-bold text-stone-700">PLAY</span>
              </button>

              {/* FAST FORWARD (Next Track) */}
              <button
                onClick={onNextTrack}
                disabled={!powerOn}
                title="Morceau suivant"
                className="mech-button flex flex-col items-center justify-center w-9 h-11 rounded active:translate-y-0.5"
              >
                <FastForward className="w-3.5 h-3.5 text-stone-800" />
                <span className="text-[7px] font-bold text-stone-700">FFWD</span>
              </button>

              {/* PAUSE */}
              <button
                onClick={onPlayToggle}
                disabled={!powerOn}
                title="Pause"
                className={`mech-button flex flex-col items-center justify-center w-9 h-11 rounded ${
                  !isPlaying ? 'active' : ''
                }`}
              >
                <Pause className="w-3.5 h-3.5 text-stone-800" />
                <span className="text-[7px] font-bold text-stone-700">PAUSE</span>
              </button>

              {/* STOP / EJECT */}
              <button
                onClick={() => isPlaying && onPlayToggle()}
                disabled={!powerOn}
                title="Stop"
                className="mech-button flex flex-col items-center justify-center w-9 h-11 rounded"
              >
                <Square className="w-3.5 h-3.5 text-stone-800" />
                <span className="text-[7px] font-bold text-stone-700">STOP</span>
              </button>
            </div>
          </div>

          {/* Jacks & Bias switch */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-300">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-stone-900 border-2 border-stone-400 shadow-inner flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-950" />
                </div>
                <span className="text-[7px] text-stone-600 font-bold mt-0.5">PHONES</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-stone-900 border-2 border-stone-400 shadow-inner flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-950" />
                </div>
                <span className="text-[7px] text-stone-600 font-bold mt-0.5">MIC</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[7px] text-stone-600 font-bold uppercase">BIAS SELECT</span>
              <div className="flex gap-1 text-[7px] font-bold text-stone-500">
                <span className="px-1 bg-stone-300 rounded text-stone-800">NORM</span>
                <span>CrO2</span>
                <span>METAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
