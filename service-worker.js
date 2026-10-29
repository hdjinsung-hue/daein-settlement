const CACHE_NAME = 'daein-settlement-v1-2-webthreads1';
const CORE = [
  './',
  './index.html',
  './manifest.json?v=1.2-fault',
  './icon-192.png?v=1.2-fault',
  './icon-512.png?v=1.2-fault',
  './apple-touch-icon.png?v=1.2-fault',
  './favicon-32.png?v=1.2-fault'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
  );
});
