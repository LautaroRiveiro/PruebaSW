//------------------------------------------
// Eventos del SW que afectan el API Cache
//------------------------------------------

//Evento install: Se dispara cuando se instala el Service Worker, únicamente la primera vez
self.addEventListener("install", (resp)=>{
    console.log("Service Worker: Instalado", resp);
    console.log("Self (ServiceWorkerGlobalScope)", self);
});

//Evento activate: Actualiza la caché
self.addEventListener("activate", (resp)=>{
    console.log("Service Worker: Actualizado", resp);
});

//Evento fetch: Recupera activos ya sea de la caché, de la red, o de algún otro medio
self.addEventListener("fetch", (resp)=>{
    console.log("Service Worker: Recuperando", resp);
});