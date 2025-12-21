/**
 * Service Worker - BMS Ventouse
 * Minimal PWA cache to improve reliability and PWA score.
 * Strategy:
 *  - Precache core shell (HTML/CSS/JS/icons/manifest)
 *  - Network-first for HTML
 *  - Cache-first with runtime caching for assets
 */
const VERSION = 'v1';
const CACHE_NAME = `bms-cache-${VERSION}-${Date.now()}`;
const CORE_ASSETS = [
  '/', '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ne mettre en cache que les requêtes GET du même origin
  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) {
    // Laisser le navigateur gérer les ressources externes (fonts, analytics, etc.)
    return;
  }

  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');

  if (isHTML) {
    // Network-first for HTML with offline fallback to cached index
    event.respondWith(
      fetch(req).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        return resp;
      }).catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  // Cache-first for assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        return resp;
      }).catch(() => cached || Response.error());
    })
  );
});