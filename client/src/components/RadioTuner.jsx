import React from 'react';

export default function RadioTuner({
  tracks = [],
  currentIndex = 0,
}) {
  const currentTrack = tracks[currentIndex];
  const total = tracks.length > 1 ? tracks.length - 1 : 1;
  const needlePercent = tracks.length > 0 ? (currentIndex / total) * 88 + 6 : 50;
  const frequency = (88.0 + (needlePercent / 100) * 20.0).toFixed(1);

  return (
    <div className="relative brushed-aluminum p-3 rounded-lg border-2 border-stone-500 shadow-xl flex flex-col justify-between h-full select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Model & Branding */}
      <div className="flex justify-between items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-hardware font-black text-sm tracking-wider text-stone-900">ST-700</span>
          <span className="text-[10px] tracking-widest font-hardware font-bold text-stone-700 uppercase">
            AM/FM STEREO TUNER · TIMELINE MONITOR
          </span>
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-stone-600 font-hardware font-bold uppercase">STEREO</span>
            <div className="w-2 h-2 rounded-full red-led-on" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-stone-600 font-hardware font-bold uppercase">TUNED</span>
            <div className="w-2 h-2 rounded-full green-led-on" />
          </div>
        </div>
      </div>

      {/* Radio Glass Scale & Decorative Tuning Knob */}
      <div className="flex items-center gap-4 px-2 my-auto">
        {/* The Backlit Glass Scale */}
        <div className="relative flex-1 h-[105px] bg-[#14120e] rounded-lg border-2 border-stone-700 shadow-inner overflow-hidden p-2 flex flex-col justify-between shadow-[inset_0_0_20px_rgba(255,180,60,0.15)]">
          {/* Warm Amber Glow Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-gradient-to-b from-amber-600/30 to-amber-900/10" />

          {/* Scale Markings: FM */}
          <div className="relative z-10">
            <div className="flex justify-between items-center text-[10px] font-hifi font-bold text-amber-500/90 border-b border-amber-900/50 pb-0.5">
              <span className="text-xs text-amber-400 font-hardware font-bold">FM</span>
              <span>88</span>
              <span>92</span>
              <span>96</span>
              <span>100</span>
              <span>104</span>
              <span>108</span>
              <span className="text-[9px] text-amber-600 font-hifi">MHz</span>
            </div>
            {/* Frequency ticks */}
            <div className="flex justify-between px-6 pt-0.5 text-amber-700/60 font-hifi text-[6px]">
              {Array.from({ length: 21 }).map((_, i) => (
                <div key={i} className={`w-[1px] bg-amber-600/50 ${i % 4 === 0 ? 'h-2 bg-amber-400' : 'h-1'}`} />
              ))}
            </div>
          </div>

          {/* Scale Markings: AM */}
          <div className="relative z-10 pt-1">
            <div className="flex justify-between items-center text-[9px] font-hifi text-amber-600/80 border-t border-amber-900/40 pt-0.5">
              <span className="text-[10px] text-amber-500 font-hardware font-bold">AM</span>
              <span>530</span>
              <span>700</span>
              <span>900</span>
              <span>1200</span>
              <span>1400</span>
              <span>1600</span>
              <span className="text-[8px] text-amber-700 font-hifi">kHz</span>
            </div>
          </div>

          {/* Glowing Red Tuning Needle */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-300 ease-out flex flex-col items-center"
            style={{ left: `${needlePercent}%` }}
          >
            <div className="w-[2.5px] h-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <div className="absolute top-1 w-2.5 h-1 bg-red-400 rounded-sm" />
          </div>

          {/* Current Frequency & Timestamp Display */}
          <div className="relative z-10 flex justify-between items-center px-1 text-[8px] text-stone-400 border-t border-stone-800 pt-0.5">
            <span className="text-amber-300 font-digital text-sm font-bold tracking-widest">
              {frequency} MHz
            </span>
            <span className="text-stone-300 font-hifi truncate max-w-[220px]">
              {currentTrack?.nowPlaying
                ? '🔴 EN CE MOMENT (LIVE)'
                : currentTrack?.date
                ? `📅 ${currentTrack.date}`
                : 'Piste sélectionnée'}
            </span>
          </div>
        </div>

        {/* Decorative Tuning Knob (Aesthetic only, non-interactive) */}
        <div className="flex flex-col items-center pointer-events-none flex-shrink-0">
          <span className="text-[8px] font-hardware font-bold text-stone-600 uppercase tracking-wider mb-1">TUNING</span>
          <div className="w-16 h-16 rounded-full knob-silver relative border-2 border-stone-500 flex items-center justify-center shadow-lg">
            <div className="absolute inset-1 rounded-full border border-dashed border-stone-400/50" />
            <div
              className="w-1.5 h-6 bg-stone-800 rounded-full absolute -top-0.5 transition-transform duration-300"
              style={{ transform: `rotate(${needlePercent * 3.6}deg)` }}
            />
          </div>
          <span className="text-[7px] text-stone-500 font-hifi mt-1">FLY-WHEEL</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[8px] text-stone-500 font-hifi px-4 flex-shrink-0">
        <span>PHASE LOCKED LOOP (PLL) SYNTHESIZER</span>
        <span>AUTO-TRACKING TIMELINE</span>
      </div>
    </div>
  );
}
