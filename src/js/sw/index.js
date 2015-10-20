require('serviceworker-cache-polyfill');
var CACHE_NAME = 'giphyland-v1';

var urlsToCache = [
  './',
  '/css/all.css',
  '/js/page.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// self.addEventListener('activate', function(event) {
//   var cacheWhitelist = ['giphyland-v2'];
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).catch(function(){
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          return response;
        }
      );
    })
  );
});
