// Hand written to keep a build plugin out of the project.
// Vite's assets are hashed, so their cache never goes stale; only
// navigation needs to hit the network first.
const CACHE = 'task-manager-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

function store(request, response) {
  if (response.ok) {
    caches.open(CACHE).then((cache) => cache.put(request, response.clone()))
  }

  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return
  if (new URL(request.url).origin !== self.location.origin) return

  // Navigation: network first, to pick up new deploys as soon as there is a network.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => store(request, response))
        .catch(async () => {
          const cached = await caches.match('/index.html')
          return cached ?? new Response('Offline', { status: 503 })
        }),
    )
    return
  }

  event.respondWith(
    caches
      .match(request)
      .then(
        (cached) =>
          cached ?? fetch(request).then((response) => store(request, response)),
      ),
  )
})
