import React, { useEffect, useRef } from 'react';

export default function SpectrumAnalyzer({ isPlaying, track, powerOn = true }) {
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

    let peaks = new Array(numBars).fill(0);
    let barHeights = new Array(numBars).fill(2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!powerOn) return;

      for (let i = 0; i < numBars; i++) {
        const x = 12 + i * (barWidth + barGap);

        if (isPlaying) {
          const target = Math.floor(
            Math.random() * (numSegments - 3) +
              Math.sin(Date.now() / 200 + i * 0.4) * 3 +
              (i < 6 ? 4 : 2)
          );
          barHeights[i] = Math.max(1, Math.min(numSegments, target));
        } else {
          barHeights[i] = 1;
        }

        if (barHeights[i] >= peaks[i]) {
          peaks[i] = barHeights[i];
        } else {
          peaks[i] = Math.max(0, peaks[i] - 0.15);
        }

        for (let s = 0; s < numSegments; s++) {
          const y = canvas.height - 10 - s * (segmentHeight + segmentGap);
          const isLit = s < barHeights[i];
          const isPeak = Math.floor(peaks[i]) === s;

          if (isLit || isPeak) {
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
            ctx.fillStyle = '#221508';
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(x, y, barWidth, segmentHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, powerOn]);

  return (
    <div className="relative brushed-aluminum p-3 rounded-lg border-2 border-stone-500 shadow-xl flex flex-col justify-between h-full select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Header Info */}
      <div className="flex justify-between items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-hardware font-black text-sm tracking-wider text-stone-900">SE-800</span>
          <span className="text-[10px] tracking-widest font-hardware font-bold text-stone-700 uppercase">
            DIGITAL FREQUENCY SPECTRUM ANALYZER
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] uppercase tracking-wider text-stone-600 font-hardware font-bold">PEAK HOLD</span>
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'amber-led-on' : 'amber-led-off'}`} />
        </div>
      </div>

      {/* Main Display & Controls Area */}
      <div className="flex items-center justify-around gap-4 px-2 my-auto">
        {/* Recessed Dark Spectrum Screen */}
        <div className="relative bg-[#100c08] border-2 border-stone-700 rounded-md p-2 shadow-inner flex flex-col items-center">
          <div className="flex justify-between w-full px-2 text-[8px] tracking-wider text-amber-500/70 font-hifi">
            <span>63Hz</span>
            <span>250Hz</span>
            <span>1kHz</span>
            <span>4kHz</span>
            <span>16kHz</span>
          </div>

          <canvas
            ref={canvasRef}
            width={340}
            height={90}
            className="w-full max-w-[340px] h-[85px] my-1"
          />

          <div className="w-full flex justify-between px-2 text-[8px] text-amber-600/60 font-hifi">
            <span>-20dB</span>
            <span>-10dB</span>
            <span>-3dB</span>
            <span>0dB</span>
            <span>+3dB</span>
          </div>
        </div>

        {/* Decorative Knobs (Non-interactive, purely skeuomorphic aesthetic) */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center pointer-events-none">
            <span className="text-[8px] font-hardware font-bold text-stone-600 uppercase tracking-wider mb-1">INPUT LVL</span>
            <div className="w-11 h-11 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center shadow-md">
              <div className="w-1 h-3.5 bg-stone-800 rounded-full absolute -top-0.5" />
            </div>
            <span className="text-[7px] text-stone-500 font-hifi mt-1">CAL</span>
          </div>

          <div className="flex flex-col items-center pointer-events-none">
            <span className="text-[8px] font-hardware font-bold text-stone-600 uppercase tracking-wider mb-1">DECAY</span>
            <div className="w-11 h-11 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center shadow-md">
              <div className="w-1 h-3.5 bg-stone-800 rounded-full absolute top-1 left-2 transform rotate-45" />
            </div>
            <span className="text-[7px] text-stone-500 font-hifi mt-1">NORM</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center text-[8px] text-stone-500 font-hifi px-4 flex-shrink-0">
        <span>SOLID STATE STEREO SPECTRUM MONITOR</span>
        <span>REAL-TIME FFT 16-BAND</span>
      </div>
    </div>
  );
}
