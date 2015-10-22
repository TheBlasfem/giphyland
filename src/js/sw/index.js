require('serviceworker-cache-polyfill');
var CACHE_NAME = 'giphyland-v2';

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

self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['giphyland-v2'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);

  if (requestURL.hostname == 'api.giphy.com') {
    event.respondWith(GiphyAPIResponse(event.request));
  }else{
    event.respondWith(
      caches.match(event.request).then(function(response){
        if(response) return response;
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(function(response){
          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
    );
  }
});

function GiphyAPIResponse(request){
  if (request.headers.get('x-use-cache-only')) {
    return caches.match(request);
  }else{
    return fetch(request).then(function(response){
      var responseToCache = response.clone();
      caches.open(CACHE_NAME)
        .then(function(cache) {
          cache.put(request, responseToCache);
        });
      return response;
    });
  }
}