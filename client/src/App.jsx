import React, { useState, useEffect, useCallback } from 'react';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import RadioTuner from './components/RadioTuner';
import CassetteDeck from './components/CassetteDeck';
import CassetteLibrary from './components/CassetteLibrary';
import OfflineBanner from './components/OfflineBanner';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

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

        if (data.tracks && data.tracks.length > 0 && data.tracks[0].nowPlaying) {
          setIsPlaying(true);
        }
      }
    } catch (err) {
      setError("Impossible de joindre le serveur local. Vérifiez que l'API est démarrée.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
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
    <div className="h-screen w-screen overflow-hidden bg-[#100f0d] text-stone-200 p-2 sm:p-3 flex flex-col justify-between">
      {/* Offline/Error Notification if needed */}
      <OfflineBanner
        error={error}
        warning={warning}
        onRetry={fetchTracks}
        isRetrying={loading}
      />

      {/* 2x2 Full Screen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-2 sm:gap-3 flex-1 h-full min-h-0">
        {/* Top-Left: Frequency Spectrum Analyzer */}
        <div className="min-h-0 h-full">
          <SpectrumAnalyzer
            isPlaying={isPlaying}
            track={currentTrack}
          />
        </div>

        {/* Top-Right: AM/FM Radio Tuner & Timeline */}
        <div className="min-h-0 h-full">
          <RadioTuner
            tracks={tracks}
            currentIndex={currentIndex}
          />
        </div>

        {/* Bottom-Left: TC-90 Stereo Cassette Deck */}
        <div className="min-h-0 h-full">
          <CassetteDeck
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            tapeCounter={String(currentIndex + 1).padStart(3, '0')}
          />
        </div>

        {/* Bottom-Right: Cassette Tape Library / Archive (Replaces SA-850) */}
        <div className="min-h-0 h-full">
          <CassetteLibrary
            tracks={tracks}
            currentIndex={currentIndex}
            onSelectTrack={handleSelectTrack}
          />
        </div>
      </div>
    </div>
  );
}
