// Service worker PWA.
//
// ANTES: estrategia "caché primero" con una clave de caché fija. Eso hacía
// que, una vez instalada la app en un teléfono/navegador, casi NUNCA volviera
// a descargar la versión nueva del código — porque este archivo (sw.js) no
// cambiaba de un despliegue a otro, así que el navegador nunca detectaba una
// actualización y seguía sirviendo el HTML/JS viejo desde caché para siempre.
// Eso es lo que hacía que los cambios no se vieran aunque ya estuvieran
// desplegados en Vercel.
//
// AHORA: el documento principal (index.html / navegación) se pide SIEMPRE a
// la red primero — así cada vez que hay internet se ve la versión más
// reciente. Solo si no hay conexión se usa la última copia guardada (para que
// la app siga abriendo sin internet). Los archivos estáticos (íconos,
// manifest) sí se sirven de caché al instante, pero se refrescan en segundo
// plano en cada visita.
const CACHE = "rhhappy-v2";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // No cachear llamadas a Supabase u otras APIs: esos datos NUNCA deben venir
  // de una caché del navegador.
  if (/supabase\.co|\/functions\//.test(req.url)) return;

  const isHTML = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // Documento principal: red primero. Solo cae a la copia guardada si de
    // verdad no hay conexión.
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  // Archivos estáticos: se muestra la copia guardada al instante (rápido) y,
  // en paralelo, se pide una versión nueva a la red para la próxima vez
  // (stale-while-revalidate) — así tampoco se quedan pegados para siempre.
  e.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
