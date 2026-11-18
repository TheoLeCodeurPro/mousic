import React, { useState, useEffect, useCallback } from 'react';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import CassetteDeck from './components/CassetteDeck';
import RadioTuner from './components/RadioTuner';
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
      {/* Offline/Error Notification */}
      <OfflineBanner
        error={error}
        warning={warning}
        onRetry={fetchTracks}
        isRetrying={loading}
      />

      {/* Main Studio View: Left Stacked Hi-Fi Tower + Right Cassette Showcase */}
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 flex-1 h-full min-h-0">
        {/* Left: 3-Module Hi-Fi Stack (SE-800, TC-90, ST-700) */}
        <div className="w-full lg:w-[480px] xl:w-[530px] flex-shrink-0 flex flex-col justify-between h-full gap-2 min-h-0">
          {/* Top: SE-800 Digital Spectrum Analyzer */}
          <div className="flex-1 min-h-0">
            <SpectrumAnalyzer
              isPlaying={isPlaying}
              track={currentTrack}
            />
          </div>

          {/* Middle: TC-90 Stereo Cassette Deck */}
          <div className="flex-1 min-h-0">
            <CassetteDeck
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
              tapeCounter={String(currentIndex + 1).padStart(3, '0')}
            />
          </div>

          {/* Bottom: ST-700 AM/FM Radio Tuner & Timeline */}
          <div className="flex-1 min-h-0">
            <RadioTuner
              tracks={tracks}
              currentIndex={currentIndex}
            />
          </div>
        </div>

        {/* Right: Large Cassette Archive Showcase with scroll */}
        <div className="flex-1 h-full min-h-0 min-w-0">
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
