const CACHE_NAME = "football";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/team_info.html",
  "/match_info.html",
  "/icon.png",
  "/manifest.json",
  "/pages/home.html",
  "/pages/team.html",
  "/pages/saved.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/sw-reg.js"
];

//Save assets to cache
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

//Get assets from cache
self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
          return response || fetch (event.request);
      })
    )
  }
});

//Delete old caches
self.addEventListener("activate", function(event) {
event.waitUntil(
    caches.keys().then(function(cacheNames) {
    return Promise.all(
        cacheNames.map(function(cacheName) {
        if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
        }
        })
    );
    })
);
});

//Push notification
self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});