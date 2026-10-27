/* Template service worker: makes the app open and run without a connection.
 * Copy to scripts/sw-template.js. Set CACHE_PREFIX, SHELL_URL and the /_ and /assets/ rules for
 * your framework, and register it from the app: navigator.serviceWorker.register("/sw.js").
 * Generated into <outDir>/sw.js by scripts/build-sw.mjs; edit this template, not the output.
 *
 * Mainly needed when the app loads a remote URL (server.url) or also runs as a website/PWA.
 * A bundled Capacitor app already has its files on the device.
 *
 * - Every build's files are precached on install (so routes never visited still work offline).
 * - Page loads are network-first, falling back to the cached app shell. This assumes app routes
 *   render on the client, so one cached shell serves every URL.
 * - API/backend traffic on other origins passes straight through; offline data comes from the
 *   app's local data layer (Firestore cache, IndexedDB, SQLite), not from here.
 */
const VERSION = "__VERSION__";
const CACHE_PREFIX = "app"; // change per app so two apps on one origin never clash
const PRECACHE = CACHE_PREFIX + "-precache-" + VERSION;
const RUNTIME = CACHE_PREFIX + "-runtime";
const SHELL_URL = "/"; // a client-rendered route that boots the app (e.g. "/" or "/dashboard")
const PRECACHE_URLS = __PRECACHE_URLS__;
const NAV_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(PRECACHE_URLS);
      const shell = await fetch(SHELL_URL, { cache: "no-store" });
      if (shell.ok) await cache.put(SHELL_URL, shell);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith(CACHE_PREFIX + "-precache-") && k !== PRECACHE)
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Server functions and anything else dynamic under /_ always go to the network
  if (url.pathname.startsWith("/_")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
  } else if (url.pathname.startsWith("/assets/")) {
    // Content-hashed: a cached copy is always correct
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});

async function handleNavigation(request) {
  try {
    const response = await withTimeout(fetch(request), NAV_TIMEOUT_MS);
    if (response.ok) {
      const cache = await caches.open(PRECACHE);
      cache.put(SHELL_URL, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(SHELL_URL);
    return cached || Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) (await caches.open(RUNTIME)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cached = await caches.match(request);
  const network = fetch(request).then(async (response) => {
    if (response.ok) await (await caches.open(RUNTIME)).put(request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}
