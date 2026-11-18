import React from 'react';
import { Radio } from 'lucide-react';

export default function RadioTuner({
  tracks = [],
  currentIndex = 0,
  onSelectIndex,
  powerOn,
}) {
  const currentTrack = tracks[currentIndex];
  // Calculate needle position between 5% and 95% based on index or time
  const total = tracks.length > 1 ? tracks.length - 1 : 1;
  const needlePercent = tracks.length > 0 ? (currentIndex / total) * 90 + 5 : 50;

  // Approximate FM frequency based on needle position (88MHz to 108MHz)
  const frequency = (88.0 + (needlePercent / 100) * 20.0).toFixed(1);

  return (
    <div className="relative brushed-aluminum p-4 border-b-2 border-stone-400 select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Model & Branding */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs tracking-wider text-stone-800">ST-700</span>
          <span className="text-[10px] tracking-widest font-semibold text-stone-600 uppercase">
            AM/FM STEREO TUNER · TIMELINE EXPLORER
          </span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-stone-600 font-bold uppercase">STEREO</span>
            <div className={`w-2 h-2 rounded-full ${powerOn ? 'red-led-on' : 'bg-red-950 opacity-40'}`} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-stone-600 font-bold uppercase">TUNED</span>
            <div className={`w-2 h-2 rounded-full ${powerOn ? 'green-led-on' : 'bg-green-950 opacity-40'}`} />
          </div>
        </div>
      </div>

      {/* Radio Glass & Scale */}
      <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
        {/* The Backlit Glass Scale */}
        <div
          className={`relative flex-1 w-full h-[95px] bg-[#14120e] rounded-lg border-3 border-stone-700 shadow-inner overflow-hidden p-2 flex flex-col justify-between transition-all duration-700 ${
            powerOn ? 'shadow-[inset_0_0_20px_rgba(255,180,60,0.15)]' : ''
          }`}
        >
          {/* Warm Amber Glow Overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              powerOn ? 'opacity-25 bg-gradient-to-b from-amber-600/30 to-amber-900/10' : 'opacity-0'
            }`}
          />

          {/* Scale Markings: FM */}
          <div className="relative z-10">
            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-amber-500/90 border-b border-amber-900/50 pb-0.5">
              <span className="text-[10px] text-amber-400 font-sans font-bold">FM</span>
              <span>88</span>
              <span>92</span>
              <span>96</span>
              <span>100</span>
              <span>104</span>
              <span>108</span>
              <span className="text-[8px] text-amber-600">MHz</span>
            </div>
            {/* Frequency ticks */}
            <div className="flex justify-between px-6 pt-0.5 text-amber-700/60 font-mono text-[6px]">
              {Array.from({ length: 21 }).map((_, i) => (
                <div key={i} className={`w-[1px] bg-amber-600/50 ${i % 4 === 0 ? 'h-2 bg-amber-400' : 'h-1'}`} />
              ))}
            </div>
          </div>

          {/* Scale Markings: AM */}
          <div className="relative z-10 pt-1">
            <div className="flex justify-between items-center text-[8px] font-mono text-amber-600/80 border-t border-amber-900/40 pt-0.5">
              <span className="text-[9px] text-amber-500 font-sans font-bold">AM</span>
              <span>530</span>
              <span>700</span>
              <span>900</span>
              <span>1200</span>
              <span>1400</span>
              <span>1600</span>
              <span className="text-[7px] text-amber-700">kHz</span>
            </div>
          </div>

          {/* Glowing Red Tuning Needle */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-300 ease-out flex flex-col items-center"
            style={{ left: `${needlePercent}%` }}
          >
            <div className={`w-[2.5px] h-full ${powerOn ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-900'}`} />
            <div className="absolute top-1 w-2.5 h-1 bg-red-400 rounded-sm" />
          </div>

          {/* Current Frequency & Timestamp Display */}
          <div className="relative z-10 flex justify-between items-center px-1 text-[8px] font-mono text-stone-400 border-t border-stone-800 pt-0.5">
            <span className="text-amber-300 font-bold tracking-wider">
              {powerOn ? `${frequency} MHz` : '--.- MHz'}
            </span>
            <span className="text-stone-400 truncate max-w-[200px]">
              {currentTrack?.nowPlaying
                ? '🔴 EN CE MOMENT (LIVE)'
                : currentTrack?.date
                ? `📅 ${currentTrack.date}`
                : 'Piste sélectionnée'}
            </span>
          </div>
        </div>

        {/* Right Side: Big Knurled Silver Tuning Knob */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider mb-1">TUNING</span>
          <div
            onClick={() => {
              if (!tracks.length) return;
              const next = (currentIndex + 1) % tracks.length;
              onSelectIndex(next);
            }}
            title="Tourner pour changer de morceau"
            className="w-16 h-16 rounded-full knob-silver relative border-2 border-stone-500 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            {/* Knob grooves / knurling pattern */}
            <div className="absolute inset-1 rounded-full border border-dashed border-stone-400/50" />
            <div
              className="w-1.5 h-6 bg-stone-800 rounded-full absolute -top-0.5 transition-transform duration-300"
              style={{ transform: `rotate(${needlePercent * 3.6}deg)` }}
            />
          </div>
          <span className="text-[7px] text-stone-500 font-mono mt-1">CLICK TO TUNE</span>
        </div>
      </div>
    </div>
  );
}
