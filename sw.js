// Define un nombre y versión para la caché
const CACHE_NAME = 'v1';

// Evento 'install': Se dispara cuando el SW se instala
self.addEventListener('install', event => {
    console.log('SW: Instalando...');
    
    // Fuerza al nuevo service worker a activarse inmediatamente
    self.skipWaiting(); 

    // Espera hasta que la promesa se resuelva
    event.waitUntil(
        // Abre la caché con el nombre definido
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Almacenando archivos en caché');
                // Añade los archivos principales a la caché
                return cache.addAll([
                    './',           // El index.html
                    './script.js',  // El script principal
                    './obj.png'     // Un recurso de imagen de ejemplo
                ]);
            })
            .catch(err => {
                console.log("Error al almacenar en caché durante la instalación:", err);
            })
    );
});

// Evento 'activate': Se dispara cuando el SW se activa (después de la instalación)
// Se usa comúnmente para limpiar cachés antiguas
self.addEventListener('activate', event => {
    console.log('SW: Activando...');
    
    event.waitUntil(
        caches.keys()
            .then(keys => {
                // Borra las cachés que no coincidan con el nombre de la caché actual
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
    );
});

// Evento 'fetch': Se dispara cada vez que la página realiza una solicitud de red
self.addEventListener('fetch', event => {
    console.log('SW: Interceptando fetch para:', event.request.url);

    // Responde a la solicitud
    event.respondWith(
        // Intenta encontrar la solicitud en la caché
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en la caché, la devuelve
                if (response) {
                    console.log('SW: Devolviendo desde caché:', event.request.url);
                    return response;
                }

                // Si no está en la caché, realiza la solicitud de red real
                console.log('SW: Realizando fetch a la red:', event.request.url);
                return fetch(event.request);
            })
    );
});