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

self.addEventListener('fetch', function(event) {
  event.respondWith(
   caches.match(event.request).catch(function(){
     //event.default() returns a response-promise for the original request
     return event.default();
   });
  );
});