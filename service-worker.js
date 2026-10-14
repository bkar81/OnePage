//One Page Wisdom
const CACHE_PREFIX = "onepage-wisdom-cache-";
const CACHE_NAME = CACHE_PREFIX + "v1.0.2";
const ASSETS = ["./", "./index.html", "./manifest.json", "./pwa-192x192.png", "./pwa-512x512.png", "./pwa-maskable-512x512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", event => { if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting(); });
function cachedShell() {
  return caches.open(CACHE_NAME).then(cache => cache.match("./index.html")).then(response => response || new Response("OnePage Wisdom is offline and the app shell is not cached yet. Reconnect and open the app once.", {status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}}));
}
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const isShell = url.pathname.endsWith("/index.html") || url.pathname.endsWith("/");
  event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(request, {ignoreSearch:true}).then(cached => {
    const network = fetch(request).then(response => {
      if (response && response.status === 200) cache.put(request, response.clone()).catch(()=>{});
      return response;
    }).catch(() => cached || (isShell ? cachedShell() : Promise.reject(new Error("Offline resource unavailable"))));
    // Network-first for the app shell so new releases are discovered; cache-first for known static assets.
    return isShell ? network.catch(() => cached || cachedShell()) : (cached || network);
  })));
});
