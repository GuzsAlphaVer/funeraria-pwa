const CACHE_NAME = "funeraria-cache-v4";  // Incrementa la versión
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/favicon-96x96.png',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/favicon.ico'
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("[SW] Cacheando recursos estáticos");
                return cache.addAll(STATIC_ASSETS).catch(err => {
                    console.error("[SW] Error al cachear:", err);
                });
            })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Estrategia Cache First para assets locales
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(event.request);
                })
        );
    }
    // Para API, usa Network First con fallback a caché
    else if (url.origin.includes("mockapi.io")) {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    // No cacheamos respuestas de la API para mantener datos frescos
                    return networkResponse;
                })
                .catch(() => {
                    // En caso de offline, muestra un mensaje apropiado
                    return new Response(JSON.stringify({
                        message: "Estás offline. Los datos pueden no estar actualizados."
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                })
        );
    }
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});