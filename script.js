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