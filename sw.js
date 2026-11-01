const CACHE_NAME = 'socket-market-network-only-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => {
            if (name !== CACHE_NAME) return caches.delete(name);
        }));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith((async () => {
        try {
            const response = await fetch(event.request, { cache: 'no-store' });
            return response;
        } catch (error) {
            return caches.match(event.request);
        }
    })());
});
