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