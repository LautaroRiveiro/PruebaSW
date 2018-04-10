//-----------------------------------
// Registro del Service Worker
//-----------------------------------

//Si el objeto navigator tiene la propiedad serviceWorker es porque ese navegador soporta los SW
if('serviceWorker' in navigator){

    //En cuanto se produzca la carga del objeto window, ya se puede registrar el SW
    window.addEventListener('load',()=>{
        
        
        navigator.serviceWorker.register( './sw.js' )
        .then( registro => console.log( "Service Worker Registrado", registro ) )
        .catch( e => console.log( "Error al registrar SW", e ) )
        
    })
    
}

//-----------------------------------
// Uso del CACHE API
//-----------------------------------
/*
//El método open carga la variable global cache con los datos de la caché indicada o la crea si no existe.
caches.open('Cache de Prueba')
.then( cache => {

    //El método add agrega una Request a la Caché
    cache.add('./script').catch( error => console.log("Error al cargar recurso", error));

    
})
.catch( e => console.log( "Error al abrir Caché", e ) )*/


//-----------------------------------
// Uso del PUSH & NOTIFICATIONS API
//-----------------------------------

// Si el navegador soporta las Notificaciones y no fueron bloqueadas por el usuario, solicito permiso
if ( window.Notification && Notification.permission !== 'denied' ) {
    Notification.requestPermission( status => {
        console.info("status ", status);
    })
}

//-----------------------------------
// Uso del Estado de Conexión
//-----------------------------------
function cambioEstado(e){
    
    const header  = document.querySelector('.header');
    const metaTag = document.querySelector('meta[name=theme-color]');
    console.info("Cambio Estado", e, header);

    if ( navigator.onLine ) {
        console.info("Se ha conectado");
        header.classList.remove('offline');
        metaTag.setAttribute('content', '#F7DF1E');
    }
    else{
        console.info("Se ha desconectado");
        header.classList.add('offline');
        metaTag.setAttribute('content', '#666');
    }
}

// Evento equivalente al document.ready en JQuery
document.addEventListener('DOMContentLoaded', e => {
    
    console.info("DOMContentLoaded",e)

    if ( !navigator.onLine ) {
        console.info("SIN CONEXION this:", this);
        cambioEstado( this );
    }

    window.addEventListener('offline', cambioEstado);
    window.addEventListener('online',  cambioEstado);
});

//-----------------------------------
// Registro del BACKGROUND SYNC API
//-----------------------------------

// Para poder registrar la BGSync el navegador debe soportar SW y SyncManager
if ( 'serviceWorker' in navigator && 'SyncManager' in window ) {

    // El serviceWorker.ready es una promesa que se devuelve el registro del SW cuando está listo.
    // En ese momento y desde ese registro, puedo registrarle la BGSync, pasándole un identificador.
    navigator.serviceWorker.ready
    .then( registroSW => {

        return registroSW.sync.register('etiquetaClave')
        .then( ()=>console.info("Sincronización registrada") )

    })
    .catch( error => console.info("Error al activar Sync", error) )
};