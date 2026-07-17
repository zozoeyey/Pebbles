// Minimal service worker: makes Pebbles installable (Add to Home Screen).
// Network-first passthrough — no caching surprises during development.
// Push notification handling will land here when daily nudges ship.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
  // Intentionally empty: browser handles the request normally.
});
