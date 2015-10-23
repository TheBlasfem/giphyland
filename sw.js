(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/js/sw/index.js":[function(require,module,exports){
require('serviceworker-cache-polyfill');
var CACHE_NAME = 'giphyland-v3';

var urlsToCache = [
  './',
  '/css/all.css',
  '/js/page.js',
  '/img/cat-icon.png'
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
  var cacheWhitelist = ['giphyland-v3'];
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
},{"serviceworker-cache-polyfill":"/Users/juliolopez/Desktop/giphyland/node_modules/serviceworker-cache-polyfill/index.js"}],"/Users/juliolopez/Desktop/giphyland/node_modules/serviceworker-cache-polyfill/index.js":[function(require,module,exports){
if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();
      
      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

},{}]},{},["./src/js/sw/index.js"])


//# sourceMappingURL=sw.js.map
