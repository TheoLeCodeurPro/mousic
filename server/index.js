import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME || 'TheoInTheMelo';
const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS, 10) || 60;

app.use(cors());
app.use(express.json());

// In-Memory Cache
let memoryCache = {
  data: null,
  timestamp: 0,
  lastSuccessfulFetch: null,
};

// Request counter to prove cache effectiveness in console/demo
let stats = {
  totalApiRequests: 0,
  lastFmCalls: 0,
  cacheHits: 0,
};

// API Endpoint: /api/recent-tracks
app.get('/api/recent-tracks', async (req, res) => {
  stats.totalApiRequests++;
  const now = Date.now();
  const cacheAgeMs = now - memoryCache.timestamp;
  const ttlMs = CACHE_TTL_SECONDS * 1000;

  // 1. Check Cache
  if (memoryCache.data && cacheAgeMs < ttlMs) {
    stats.cacheHits++;
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('X-Cache-Age-Seconds', Math.round(cacheAgeMs / 1000));
    return res.json({
      ...memoryCache.data,
      cached: true,
      cacheAgeSeconds: Math.round(cacheAgeMs / 1000),
      cacheTtlSeconds: CACHE_TTL_SECONDS,
      stats,
    });
  }

  // 2. Validate API Key
  if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({
      error: true,
      message: 'Clé API Last.fm manquante ou non configurée dans le fichier .env du serveur.',
      hint: 'Configurez LASTFM_API_KEY dans votre fichier .env et redémarrez.',
      cached: false,
      tracks: memoryCache.data ? memoryCache.data.tracks : [],
    });
  }

  // 3. Fetch from Last.fm
  try {
    stats.lastFmCalls++;
    const targetUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      LASTFM_USERNAME
    )}&api_key=${LASTFM_API_KEY}&format=json&limit=25`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Last.fm API returned HTTP ${response.status}`);
    }

    const rawData = await response.json();

    if (rawData.error) {
      throw new Error(`Last.fm Error ${rawData.error}: ${rawData.message}`);
    }

    const recentTracksObj = rawData.recenttracks || {};
    const trackList = recentTracksObj.track || [];
    const tracksArray = Array.isArray(trackList) ? trackList : [trackList];

    // Format & clean track data
    const formattedTracks = tracksArray.map((t, idx) => {
      const isNowPlaying = t['@attr'] && t['@attr'].nowplaying === 'true';
      const images = t.image || [];
      const coverUrl =
        (images.find((img) => img.size === 'extralarge') ||
          images.find((img) => img.size === 'large') ||
          images[images.length - 1] || {})['#text'] || '';

      return {
        id: `${t.mbid || t.name}-${t.date?.uts || idx}`,
        name: t.name || 'Titre inconnu',
        artist: t.artist?.['#text'] || t.artist?.name || 'Artiste inconnu',
        album: t.album?.['#text'] || 'Album inconnu',
        coverUrl: coverUrl,
        nowPlaying: Boolean(isNowPlaying),
        date: t.date ? t.date['#text'] : isNowPlaying ? 'En ce moment' : '',
        timestamp: t.date ? parseInt(t.date.uts, 10) : Date.now(),
        url: t.url || '',
      };
    });

    const responsePayload = {
      username: recentTracksObj['@attr']?.user || LASTFM_USERNAME,
      totalTracks: parseInt(recentTracksObj['@attr']?.total || formattedTracks.length, 10),
      totalPages: parseInt(recentTracksObj['@attr']?.totalPages || 1, 10),
      tracks: formattedTracks,
      lastUpdated: new Date().toISOString(),
      cached: false,
    };

    // Update memory cache
    memoryCache = {
      data: responsePayload,
      timestamp: now,
      lastSuccessfulFetch: now,
    };

    res.setHeader('X-Cache', 'MISS');
    return res.json({
      ...responsePayload,
      cacheTtlSeconds: CACHE_TTL_SECONDS,
      stats,
    });
  } catch (err) {
    console.error('[Last.fm Fetch Error]', err.message);

    // Fallback if Last.fm fails: serve stale cache if available
    if (memoryCache.data) {
      return res.status(200).json({
        ...memoryCache.data,
        cached: true,
        stale: true,
        warning: 'Last.fm est temporairement inaccessible. Données en cache utilisées.',
        errorMessage: err.message,
        stats,
      });
    }

    // No cache available at all
    return res.status(503).json({
      error: true,
      message: 'Impossible de joindre Last.fm et aucune donnée en cache disponible.',
      details: err.message,
      tracks: [],
      stats,
    });
  }
});

// API Endpoint: /api/stats (useful for demo inspection)
app.get('/api/stats', (req, res) => {
  res.json({
    user: LASTFM_USERNAME,
    hasApiKey: Boolean(LASTFM_API_KEY && LASTFM_API_KEY !== 'YOUR_API_KEY_HERE'),
    cacheTtlSeconds: CACHE_TTL_SECONDS,
    cacheAgeSeconds: memoryCache.timestamp ? Math.round((Date.now() - memoryCache.timestamp) / 1000) : null,
    stats,
  });
});

// Serve frontend in production
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  // Express 5 compatible SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`📻 Hi-Fi Last.fm Server running on http://localhost:${PORT}`);
  console.log(`👤 Target User: ${LASTFM_USERNAME}`);
  console.log(`⚡ Cache TTL: ${CACHE_TTL_SECONDS}s`);
  console.log(`🔑 API Key configured: ${Boolean(LASTFM_API_KEY && LASTFM_API_KEY !== 'YOUR_API_KEY_HERE')}`);
  console.log(`===============================================`);
});
