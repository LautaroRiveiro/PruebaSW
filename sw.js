const NOMBRE_CACHE = 'CacheTest-v2';
const recursosNecesarios = [
    //Todas estas son formas posibles distintas de acceder al Home
    '/',
    './',
    './?utm=homescreen',
    './index.html?utm=homescreen',
    './index.html',

    //Otros archivos necesarios
    './sw.js',
    './script.js'
];

//------------------------------------------
// Eventos del SW que afectan el API Cache
//------------------------------------------

// Evento install: Se dispara cuando se instala el Service Worker, únicamente la primera vez. Si se
// actualiza el SW, el navegador instala el nuevo.
self.addEventListener("install", ( installEvent )=>{
    console.log( "Service Worker: Instalado", installEvent );

    /* Al momento de instalar el WS registro en la Caché todos los recursos que considero necesarios
     * para que la aplicación funcione offline. De esta manera me aseguro que si el WS se instala con
     * éxito, es porque en la caché se registraron los recursos con éxito. */
    installEvent.waitUntil(
        caches.open( NOMBRE_CACHE )
        .then( cache =>{
            return cache.addAll( recursosNecesarios );
        })
        .catch( error => console.info(error) )
    )
});

// Evento activate: En este evento se activa el SW. Si se actualiza el SW, entonces para que el nuevo
// reemplace al viejo, tiene que esperar a cerrar la navegación actual y ahí se va a activar.
// En este método hay que actualizar la caché con los recursos nuevos y sacando los obsoletos.
self.addEventListener("activate", ( extendableEvent )=>{
    
    console.log("Service Worker: Activado", extendableEvent);
    const cacheList = [NOMBRE_CACHE]; //Esta es la lista de los nuevos caché necesarios

    // Debo retrasar la activación del SW hasta tanto elimine las cachés obsoletas.
    extendableEvent.waitUntil(
        caches.keys()
        .then( cachesNames =>{
            console.info("cachesNames",cachesNames);
            // Reduce a un promise solo un conjunto de promises.
            return Promise.all(
                // El map transforma un array de una cosa a un array de otra
                cachesNames.map( cacheName =>{
                    if ( cacheList.indexOf( cacheName ) === -1) {
                        console.info(`Caché ${cacheName} será deleteada`);
                        return caches.delete( cacheName );
                    }
                })
            )
        })
        .then( ()=>{
            console.info("Las cachés fueron actualizadas", self);
            // Le digo al SW que active los elementos actuales y esté a la espera de cambios
            return self.clients.claim();
        })
    );
});

// Evento fetch: Recupera activos ya sea de la caché, de la red, o de algún otro medio. Si la petición no
// está en la caché, hay que aprovechar para agregarla.
self.addEventListener("fetch", fetchEvent => {

    console.log("Service Worker: Recuperando", fetchEvent);

    // Busco entre las cachés el recurso. Si está lo devuelvo, si no hago un fetch a la red. Luego lo agrego
    fetchEvent.respondWith(
        caches.match( fetchEvent.request )
        .then( function(response) {
            if (response) {
                console.info("RESPONSE DEL FETCH");
                return response;
            }
            return fetch( fetchEvent.request )
            .then( response => {
                let respToCache = response.clone();
                caches.open( NOMBRE_CACHE )
                .then( cache => {
                    cache.put( fetchEvent.request, respToCache )
                    .catch( error => console.info("Error al registrar nueva petición al caché", error))
                })
                return response;
            })
        })
    );
});

//------------------------------------------
// Eventos de Push Notifications
//------------------------------------------

self.addEventListener("push", pushEvent => {
    console.log("Push enviado", pushEvent);
    const titulo  = "Nueva notificación";
    const opciones = {
        body: "Recibió una nueva notificación. Desea cerrar?",
        icon: 'https://imageog.flaticon.com/icons/png/512/52/52190.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF',
        data: { id: 1 },
        actions: [
            { action:'SI', title: 'OK', icon: 'http://static1.squarespace.com/static/535bc5d4e4b0b9aa739678f3/t/5652f21be4b0a58f185b18b6/1448276508945/SI-Labs-Icon-negativ-red.png?format=1000w' },
            { action:'NO', title: 'No!' }
        ],
        vibrate: [100, 50, 100]
    };

    pushEvent.waitUntil( self.registration.showNotification( titulo, opciones ) );
});

self.addEventListener('notificationclick', notificationEvent => {
    console.log("Push respuesta enviada", notificationEvent);
    if ( notificationEvent.action == 'SI' ) {
        console.log("Aceptado");
        clients.openWindow("https://google.com.ar");
    } else {
        console.log("Rechazado");
    }
    notificationEvent.notification.close();
});


//------------------------------------------
// Eventos del Background Sync
//------------------------------------------
self.addEventListener('sync', e => {
    console.info("Evento Sync", e);
})

/* waitUntil() es un método que extiende la vida de los eventos install y activate retrasando su resolución
 * hasta que se resuelva la promesa pasada como parámetro. Este método pertenece a la interface
 * ExtendableEvent que sólo se puede usar en el contexto de un ServiceWorkerGlobalScope.
 * En el caso de install, está pensado para que la instalación no termine hasta tanto se hayan cacheado
 * todos los recursos.*/