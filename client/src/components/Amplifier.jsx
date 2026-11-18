import React, { useState, useEffect } from 'react';
import { Volume2, Power } from 'lucide-react';

export default function Amplifier({
  isPlaying,
  powerOn,
  onPowerToggle,
  volume = 70,
  onVolumeChange,
}) {
  const [leftVu, setLeftVu] = useState(0);
  const [rightVu, setRightVu] = useState(0);
  const [loudness, setLoudness] = useState(true);

  // Animate VU meters
  useEffect(() => {
    if (!powerOn) {
      setLeftVu(0);
      setRightVu(0);
      return;
    }

    if (!isPlaying) {
      // Idle slight quiver
      setLeftVu(5 + Math.random() * 3);
      setRightVu(4 + Math.random() * 3);
      return;
    }

    const interval = setInterval(() => {
      // Realistic needle dynamics with peak and momentum
      const base = (volume / 100) * 55;
      const bounceLeft = base + Math.random() * 35;
      const bounceRight = base + Math.random() * 32;

      setLeftVu(Math.min(95, Math.max(5, bounceLeft)));
      setRightVu(Math.min(95, Math.max(5, bounceRight)));
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, powerOn, volume]);

  // Convert 0-100 to angle for needle (-40deg to +40deg)
  const leftAngle = -40 + (leftVu / 100) * 80;
  const rightAngle = -40 + (rightVu / 100) * 80;

  return (
    <div className="relative brushed-aluminum p-4 rounded-b-lg select-none">
      {/* 4 Corner Screws */}
      <div className="absolute top-2 left-2 hi-fi-screw" />
      <div className="absolute top-2 right-2 hi-fi-screw" />
      <div className="absolute bottom-2 left-2 hi-fi-screw" />
      <div className="absolute bottom-2 right-2 hi-fi-screw" />

      {/* Model & Branding */}
      <div className="flex justify-between items-center mb-2 px-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs tracking-wider text-stone-800">SA-850</span>
          <span className="text-[10px] tracking-widest font-semibold text-stone-600 uppercase">
            INTEGRATED STEREO AMPLIFIER · DUAL VU-METERS
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[8px] text-stone-600 font-bold uppercase">POWER</span>
          <div className={`w-2.5 h-2.5 rounded-full ${powerOn ? 'red-led-on' : 'bg-red-950 opacity-40'}`} />
        </div>
      </div>

      {/* Main Amp Faceplate: Dual VU Meters on Left, Controls on Right */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        {/* Left Side: Dual Analog VU Meters */}
        <div className="flex items-center gap-2 bg-[#12110e] border-2 border-stone-700 rounded-lg p-2 shadow-inner">
          {/* Left Channel Meter */}
          <div className="relative w-36 h-20 bg-[#1e1c18] rounded border border-stone-600 overflow-hidden flex flex-col justify-end p-1">
            {/* Meter illumination glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                powerOn ? 'opacity-30 bg-amber-500/20' : 'opacity-0'
              }`}
            />
            {/* Scale markings */}
            <div className="absolute top-2 inset-x-2 flex justify-between text-[7px] font-mono text-amber-200/90">
              <span>-20</span>
              <span>-10</span>
              <span>-5</span>
              <span>0</span>
              <span className="text-red-500 font-bold">+3</span>
            </div>
            <div className="text-[7px] text-center font-mono text-amber-500/60 pb-1">VU · LEFT CH</div>

            {/* Pivot & Needle */}
            <div className="relative w-full flex justify-center">
              <div
                className="absolute bottom-[-10px] w-[1.5px] h-16 bg-white origin-bottom transition-transform duration-100 ease-out shadow-sm"
                style={{ transform: `rotate(${leftAngle}deg)` }}
              />
              <div className="w-4 h-4 rounded-full bg-stone-900 border border-stone-500 z-10" />
            </div>
          </div>

          {/* Right Channel Meter */}
          <div className="relative w-36 h-20 bg-[#1e1c18] rounded border border-stone-600 overflow-hidden flex flex-col justify-end p-1">
            {/* Meter illumination glow */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                powerOn ? 'opacity-30 bg-amber-500/20' : 'opacity-0'
              }`}
            />
            {/* Scale markings */}
            <div className="absolute top-2 inset-x-2 flex justify-between text-[7px] font-mono text-amber-200/90">
              <span>-20</span>
              <span>-10</span>
              <span>-5</span>
              <span>0</span>
              <span className="text-red-500 font-bold">+3</span>
            </div>
            <div className="text-[7px] text-center font-mono text-amber-500/60 pb-1">VU · RIGHT CH</div>

            {/* Pivot & Needle */}
            <div className="relative w-full flex justify-center">
              <div
                className="absolute bottom-[-10px] w-[1.5px] h-16 bg-white origin-bottom transition-transform duration-100 ease-out shadow-sm"
                style={{ transform: `rotate(${rightAngle}deg)` }}
              />
              <div className="w-4 h-4 rounded-full bg-stone-900 border border-stone-500 z-10" />
            </div>
          </div>
        </div>

        {/* Center: Tone Controls (Bass, Treble, Balance) & Switches */}
        <div className="flex items-center gap-3">
          {/* Tone Dials */}
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-bold text-stone-600 uppercase">BASS</span>
              <div className="w-8 h-8 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center">
                <div className="w-1 h-2.5 bg-stone-800 rounded-full absolute -top-0.5" />
              </div>
              <span className="text-[6px] text-stone-500 font-mono mt-0.5">0</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] font-bold text-stone-600 uppercase">TREBLE</span>
              <div className="w-8 h-8 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center">
                <div className="w-1 h-2.5 bg-stone-800 rounded-full absolute -top-0.5" />
              </div>
              <span className="text-[6px] text-stone-500 font-mono mt-0.5">0</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[7px] font-bold text-stone-600 uppercase">BALANCE</span>
              <div className="w-8 h-8 rounded-full knob-silver relative border border-stone-500 flex items-center justify-center">
                <div className="w-1 h-2.5 bg-stone-800 rounded-full absolute -top-0.5" />
              </div>
              <span className="text-[6px] text-stone-500 font-mono mt-0.5">C</span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-col gap-2 border-l border-stone-300 pl-3">
            <button
              onClick={() => setLoudness(!loudness)}
              className={`w-7 h-4 rounded text-[7px] font-bold border transition-all ${
                loudness ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-inner' : 'bg-stone-300 border-stone-400 text-stone-600'
              }`}
            >
              LOUD
            </button>
            <button
              onClick={onPowerToggle}
              title="Allumer / Éteindre la chaîne Hi-Fi"
              className={`w-7 h-6 rounded flex items-center justify-center border transition-all ${
                powerOn
                  ? 'bg-red-600 border-red-700 text-white shadow-md active:translate-y-0.5'
                  : 'bg-stone-400 border-stone-500 text-stone-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Big Master Volume Dial */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-stone-600 uppercase tracking-wider mb-1">VOLUME</span>
          <div className="relative flex items-center justify-center">
            {/* Degree marks */}
            <div className="w-16 h-16 rounded-full knob-silver relative border-2 border-stone-500 flex items-center justify-center shadow-lg">
              <div
                className="w-1.5 h-6 bg-stone-800 rounded-full absolute -top-0.5 transition-transform"
                style={{ transform: `rotate(${-120 + (volume / 100) * 240}deg)` }}
              />
            </div>
          </div>
          <div className="flex justify-between w-16 text-[7px] text-stone-500 font-mono mt-1">
            <span>MIN</span>
            <span>{volume}%</span>
            <span>MAX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
