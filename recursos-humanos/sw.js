// Service worker para PWA (instalable + arranque offline básico).
// Estrategia:
// - HTML y JS/CSS del "app shell": network-first (siempre intenta traer lo último,
//   y solo cae al caché si no hay conexión). Así NO hace falta subir a mano el
//   número de versión del caché cada vez que deployas.
// - Íconos y otros assets estáticos: cache-first (rara vez cambian, cargan rápido).
const CACHE = "rhhappy-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

// Extensiones que tratamos como "app shell" (network-first)
const SHELL_RE = /\.(html?|m?js|css)(\?.*)?$/i;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // No cachear llamadas a Supabase u otras APIs.
  if (/supabase\.co|\/functions\//.test(req.url)) return;

  const isNavigation = req.mode === "navigate";
  const isShellAsset = SHELL_RE.test(new URL(req.url).pathname);

  if (isNavigation || isShellAsset) {
    // Network-first: intenta traer la versión más nueva.
    // Si falla (sin conexión), usa lo que haya en caché.
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

  // Cache-first para el resto (íconos, imágenes, fuentes, etc.)
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("./index.html"))
    )
  );
});

// Permite forzar la activación inmediata del SW nuevo desde la app
// (útil si en el futuro agregas un botón "Actualizar app").
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});
