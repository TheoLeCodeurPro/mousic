import React, { useEffect, useRef } from 'react';

export default function SpectrumAnalyzer({ isPlaying, track, powerOn }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const numBars = 16;
    const numSegments = 12;
    const barWidth = 14;
    const barGap = 6;
    const segmentHeight = 5;
    const segmentGap = 2;

    // Peak hold levels
    let peaks = new Array(numBars).fill(0);
    let barHeights = new Array(numBars).fill(2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!powerOn) {
        return; // Screen is dark when powered off
      }

      for (let i = 0; i < numBars; i++) {
        const x = 12 + i * (barWidth + barGap);

        // Calculate dynamic height based on playback
        if (isPlaying) {
          // Semi-random frequency bounce with curve (bass higher on left)
          const target = Math.floor(
            Math.random() * (numSegments - 3) + 
            Math.sin(Date.now() / 200 + i * 0.4) * 3 + 
            (i < 6 ? 4 : 2)
          );
          barHeights[i] = Math.max(1, Math.min(numSegments, target));
        } else {
          barHeights[i] = 1; // Idle baseline
        }

        // Peak hold calculation
        if (barHeights[i] >= peaks[i]) {
          peaks[i] = barHeights[i];
        } else {
          peaks[i] = Math.max(0, peaks[i] - 0.15);
        }

        // Draw segments (from bottom to top)
        for (let s = 0; s < numSegments; s++) {
          const y = canvas.height - 10 - s * (segmentHeight + segmentGap);
          const isLit = s < barHeights[i];
          const isPeak = Math.floor(peaks[i]) === s;

          if (isLit || isPeak) {
            // Colors: Green at bottom, Orange in middle, Red at top
            if (s > 9) {
              ctx.fillStyle = '#ff3333';
              ctx.shadowColor = '#ff3333';
              ctx.shadowBlur = 6;
            } else if (s > 6) {
              ctx.fillStyle = '#ff9900';
              ctx.shadowColor = '#ff9900';
              ctx.shadowBlur = 6;
            } else {
              ctx.fillStyle = '#ffaa00';
              ctx.shadowColor = '#ffaa00';
              ctx.shadowBlur = 4;
            }
          } else {
            // Unlit LED segment
            ctx.fillStyle = '#221508';
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(x, y, barWidth, segmentHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, powerOn]);

  return (
    <div className="relative brushed-aluminum p-4 rounded-t-lg border-b-2 border-stone-400 select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Header Info */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-widest text-xs uppercase text-stone-700">SOLID STATE</span>
          <span className="text-[10px] tracking-widest font-semibold text-stone-500">SE-800 DIGITAL SPECTRUM ANALYZER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-stone-600 font-bold">PEAK HOLD</span>
          <div className={`w-2 h-2 rounded-full ${powerOn && isPlaying ? 'amber-led-on' : 'amber-led-off'}`} />
        </div>
      </div>

      {/* Main Display & Controls Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        {/* Left Side: Display Mode Buttons */}
        <div className="hidden sm:flex flex-col gap-2 items-center justify-center">
          <span className="text-[9px] font-bold text-stone-600 uppercase">MODE</span>
          <div className="flex flex-col gap-1.5">
            {['FAST', 'SLOW', 'HOLD'].map((mode, idx) => (
              <button
                key={mode}
                className={`w-9 h-5 text-[8px] font-bold tracking-wider rounded border border-stone-400 shadow-sm transition-all ${
                  idx === 0 && powerOn ? 'bg-amber-100 text-stone-800 shadow-inner' : 'bg-stone-200 text-stone-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Recessed Dark Spectrum Screen */}
        <div className="relative bg-[#100c08] border-2 border-stone-700 rounded-md p-2 shadow-inner flex flex-col items-center">
          <div className="absolute top-1 left-3 flex gap-6 text-[8px] tracking-wider text-amber-500/70 font-mono">
            <span>63Hz</span>
            <span>250Hz</span>
            <span>1kHz</span>
            <span>4kHz</span>
            <span>16kHz</span>
          </div>

          <canvas
            ref={canvasRef}
            width={340}
            height={100}
            className="w-full max-w-[340px] h-[95px] mt-2"
          />

          <div className="w-full flex justify-between px-2 text-[8px] text-amber-600/60 font-mono mt-0.5">
            <span>-20dB</span>
            <span>-10dB</span>
            <span>-3dB</span>
            <span>0dB</span>
            <span>+3dB</span>
          </div>
        </div>

        {/* Right Side: Silver Rotary Knobs */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider mb-1">INPUT LVL</span>
            <div className="w-10 h-10 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center">
              <div className="w-1 h-3 bg-stone-800 rounded-full absolute -top-0.5" />
            </div>
            <span className="text-[7px] text-stone-500 font-mono mt-1">CAL</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider mb-1">DECAY</span>
            <div className="w-10 h-10 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center">
              <div className="w-1 h-3 bg-stone-800 rounded-full absolute top-1 left-2 transform rotate-45" />
            </div>
            <span className="text-[7px] text-stone-500 font-mono mt-1">NORM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
