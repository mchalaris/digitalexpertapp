// v6.25 basic service worker (cache shell + offline)
const CACHE = 'dephotos-v6-25';
const ASSETS = [
  './dephotos_v6_25_tools_tab_final.html',
  './assets/logo.png',
  './manifest.webmanifest'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE?caches.delete(k):null))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request).then(r=>{
        const copy = r.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return r;
      }).catch(()=>caches.match('./dephotos_v6_25_tools_tab_final.html')))
    );
  }
});