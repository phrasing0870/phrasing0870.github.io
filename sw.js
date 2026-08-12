const CACHE_NAME = 'egrelay-v6';

// Core shell: cached immediately on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/404.html',
  '/assets/favicon.svg',
  '/assets/styles.css',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
];

// Per-tool assets: add every file each tool needs to run offline
const TOOL_ASSETS = [
  // password-generator
  '/password-generator/',
  '/password-generator/index.html',
  '/password-generator/words/eff_large.json',

  // image-tool
  '/image-tool/',
  '/image-tool/index.html',
  '/image-tool/vendor/mozjpeg-worker.js',
  '/image-tool/vendor/oxipng-worker.js',
  '/image-tool/vendor/gifenc.js',
  '/image-tool/vendor/jszip.min.js',
  '/image-tool/vendor/utif.js',
  '/image-tool/vendor/mozjpeg/mozjpeg_enc.js',
  '/image-tool/vendor/mozjpeg/mozjpeg_enc.wasm',
  '/image-tool/vendor/oxipng/squoosh_oxipng.js',
  '/image-tool/vendor/oxipng/squoosh_oxipng_bg.wasm',

  // ledger
  '/ledger/',
  '/ledger/index.html',

  // metadata-scrubber
  '/metadata-scrubber/',
  '/metadata-scrubber/index.html',

  // qr-generator
  '/qr-generator/',
  '/qr-generator/index.html',
  '/qr-generator/qr-code-styling.js',

  // checksum-checker
  '/checksum-checker/',
  '/checksum-checker/index.html',

  // text-cleaner
  '/text-cleaner/',
  '/text-cleaner/index.html',
  '/text-cleaner/script.js',
];

const ALL_ASSETS = [...CORE_ASSETS, ...TOOL_ASSETS];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ALL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests, let everything else pass through normally
  if (event.request.method !== 'GET') return;

  // Skip Cloudflare's speculation-rules prefetch requests and any other
  // /cdn-cgi/ internal endpoints, not real page assets, not worth caching
  if (event.request.url.includes('/cdn-cgi/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache same-origin responses as we go, so anything not
          // explicitly listed above still gets cached after first visit
          if (response.ok && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline and not cached: fall back to 404 page for navigations,
          // otherwise return an empty error response so respondWith always
          // resolves to a valid Response
          if (event.request.mode === 'navigate') {
            return caches.match('/404.html');
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        })
        // In case caches.match('/404.html') itself comes back undefined
        // (cache not yet populated), still guarantee a Response
        .then((res) => res || new Response('', { status: 503, statusText: 'Offline' }));
    })
  );
});