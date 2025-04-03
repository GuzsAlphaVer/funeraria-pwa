const CACHE_NAME = "funeraria-cache-v3";
const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// Instalar el Service Worker y almacenar en caché los archivos estáticos
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] Archivos en caché");
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Interceptar solicitudes
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Evitar almacenar respuestas de MokAPI
    if (url.origin.includes("mokapi.io")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((response) => {
                if (event.request.url.startsWith(self.location.origin)) {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                }
                return response;
            });
        })
    );
});

// Activar y eliminar caché obsoleta
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activado");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cache) => cache !== CACHE_NAME)
                    .map((cache) => {
                        console.log("[Service Worker] Eliminando caché antigua:", cache);
                        return caches.delete(cache);
                    })
            );
        })
    );
});

// Screenshots
{
    "screenshots": [
        {
            "src": "screenshot-wide.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
        },
    ]
}
