import React, { useState, useEffect, useCallback } from 'react';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import CassetteDeck from './components/CassetteDeck';
import RadioTuner from './components/RadioTuner';
import Amplifier from './components/Amplifier';
import CassetteRack from './components/CassetteRack';
import OfflineBanner from './components/OfflineBanner';
import { Radio, RefreshCw, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [powerOn, setPowerOn] = useState(true);
  const [volume, setVolume] = useState(72);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [username, setUsername] = useState('TheoInTheMelo');

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recent-tracks');
      const data = await res.json();

      if (!res.ok && data.error) {
        setError(data.message || 'Erreur lors de la récupération des pistes');
        if (data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      } else {
        setError(null);
        setWarning(data.warning || null);
        setTracks(data.tracks || []);
        if (data.username) setUsername(data.username);

        setCacheInfo({
          cached: data.cached,
          age: data.cacheAgeSeconds,
          ttl: data.cacheTtlSeconds,
          stats: data.stats,
        });

        // If the first track is currently playing, set isPlaying to true
        if (data.tracks && data.tracks.length > 0 && data.tracks[0].nowPlaying) {
          setIsPlaying(true);
        }
      }
    } catch (err) {
      setError("Impossible de joindre le serveur local. Vérifiez que l'API est bien démarrée.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
    // Auto-check every 45s (handled safely by server cache)
    const interval = setInterval(fetchTracks, 45000);
    return () => clearInterval(interval);
  }, [fetchTracks]);

  const currentTrack = tracks[currentIndex] || null;

  const handleNextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleSelectTrack = (idx) => {
    setCurrentIndex(idx);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#141311] text-stone-200 flex flex-col justify-between py-6 px-3 sm:px-6">
      {/* Top Vintage Studio Header */}
      <header className="max-w-6xl mx-auto w-full mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center shadow-md">
            <Radio className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest uppercase text-stone-100 flex items-center gap-2">
              WHAT YOUR MUSIC LOOKS LIKE
            </h1>
            <p className="text-xs text-stone-400 font-mono">
              Hi-Fi Vintage Audio Stack & Archive · 1970s Skeuomorphic System
            </p>
          </div>
        </div>

        {/* User Badge & Server Cache Monitor */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <a
            href={`https://www.last.fm/user/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-xs font-mono text-stone-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>@{username}</span>
            <ExternalLink className="w-3 h-3 text-stone-500" />
          </a>

          {cacheInfo && (
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono border ${
                cacheInfo.cached
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
              }`}
              title="Cache serveur actif pour éviter d'inonder l'API Last.fm"
            >
              <Zap className="w-3 h-3" />
              <span>
                {cacheInfo.cached
                  ? `Cache: HIT (${cacheInfo.age || 0}s)`
                  : 'Cache: MISS (Fresh)'}
              </span>
            </div>
          )}

          <button
            onClick={fetchTracks}
            disabled={loading}
            title="Rafraîchir les données via le serveur"
            className="flex items-center gap-1 px-3 py-1 bg-stone-800 hover:bg-stone-700 border border-stone-600 rounded text-xs font-mono font-bold transition-all active:scale-95 text-stone-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </header>

      {/* Main Studio Console Content */}
      <main className="max-w-6xl mx-auto w-full flex-1">
        {/* Offline / Error / Warning Banner */}
        <OfflineBanner
          error={error}
          warning={warning}
          onRetry={fetchTracks}
          isRetrying={loading}
        />

        {/* 2-Column Desktop Grid / Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): The 4-Tier Vintage Hi-Fi Stack */}
          <div className="lg:col-span-7 flex flex-col shadow-2xl rounded-xl overflow-hidden border-4 border-stone-600 bg-stone-800">
            {/* Module 1: Top Digital Spectrum Analyzer */}
            <SpectrumAnalyzer
              isPlaying={isPlaying}
              track={currentTrack}
              powerOn={powerOn}
            />

            {/* Module 2: TC-90 Stereo Cassette Deck */}
            <CassetteDeck
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
              powerOn={powerOn}
              tapeCounter={String(currentIndex + 1).padStart(3, '0')}
            />

            {/* Module 3: AM/FM Radio Tuner & Timeline */}
            <RadioTuner
              tracks={tracks}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
              powerOn={powerOn}
            />

            {/* Module 4: Integrated Amplifier & Dual VU-Meters */}
            <Amplifier
              isPlaying={isPlaying}
              powerOn={powerOn}
              onPowerToggle={() => setPowerOn(!powerOn)}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>

          {/* Right Column (5 cols): Vintage Cassette Archive / Shelf */}
          <div className="lg:col-span-5 h-full">
            <CassetteRack
              tracks={tracks}
              currentIndex={currentIndex}
              onSelectTrack={handleSelectTrack}
              powerOn={powerOn}
            />
          </div>
        </div>
      </main>

      {/* Technical Footer & Compliance Indicators */}
      <footer className="max-w-6xl mx-auto w-full mt-8 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Server-Side Last.fm Proxy · Clé API sécurisée · Zero direct browser call</span>
        </div>

        <div>
          <span>Démarrage 1-clic : </span>
          <code className="bg-stone-900 px-1.5 py-0.5 rounded text-amber-400 border border-stone-800">
            docker compose up
          </code>
        </div>
      </footer>
    </div>
  );
}
