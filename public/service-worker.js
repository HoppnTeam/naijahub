
const CACHE_NAME = 'naijahub-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Network-first strategy for API requests, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip caching for POST requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Handle API requests (Supabase)
  if (url.href.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (request.method === 'GET') {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response; // Return cached response if found
      }
      return fetch(request).then((networkResponse) => {
        if (request.method === 'GET') {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clonedResponse);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

