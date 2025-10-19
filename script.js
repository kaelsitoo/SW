let registration = null;

// Función para registrar el Service Worker
function register_service_worker() {
    // Comprueba si el service worker es compatible con el navegador
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then(res => {
                registration = res;
                console.log("SW successfully registered.");
            })
            .catch(err => {
                console.log("Could not register service worker.");
            });
    }
}

// Función para anular el registro del Service Worker
function unregister_service_worker() {
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log("Service Worker ungregistered.");
            })
        })
        .catch(err => {
            console.log("Could not unregister service worker.");
        });
}

// (En el video, él también añade un listener de 'click' para probar el fetch)
window.addEventListener('click', () => {
    fetch('./obj.png')
        .then(res => res.blob())
        .then(data => {
            console.log("Desde script.js, obtuve la respuesta:", data);
        });
});

// Llamada para registrar el worker al cargar
register_service_worker();