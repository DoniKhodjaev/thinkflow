/**
 * ThinkFlow Service Worker v5.0
 * Caches app shell for offline use
 */

const CACHE_NAME = 'thinkflow-v6';

// Install — cache app shell (use relative paths for GitHub Pages subdirectory)
// We build absolute URLs from the SW's own location
const SW_DIR = self.registration.scope;
const ASSET_PATHS = [
  '',
  'index.html',
  'css/app.css',
  'js/app.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

// Install — cache app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const urls = ASSET_PATHS.map(p => new URL(p, self.registration.scope).href);
      return cache.addAll(urls);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for assets, network-first for API
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Always go to network for API calls
  if (url.hostname === 'api.anthropic.com') {
    return;
  }

  // Always go to network for Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        fetch(e.request)
          .then((resp) => {
            cache.put(e.request, resp.clone());
            return resp;
          })
          .catch(() => cache.match(e.request))
      )
    );
    return;
  }

  // Cache-first for app assets
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
