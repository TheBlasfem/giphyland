window.Promise = window.Promise || require('es6-promise').Promise;
require('whatwg-fetch');

// force https
if ((!location.port || location.port == "80") && location.protocol != 'https:') {
  location.protocol = 'https:';
}

var giphy = require('./giphy');
var photosEl = document.querySelector('.photos');
var utils = require('./utils');
var photosTemplate = require('./views/photos.hbs');
var refreshButton = document.querySelector('button.refresh');
var showingLiveData = false;

//Initial Load
var liveDataFetched = getGifsData('cats').then(function(result) {
  if (!result) return false;
  updatePage(result.data);
  showingLiveData = true;
  return true;
});

var cachedDataFetched = getCachedGifsData('cats').then(function(result) {
  if (!result) return false;
  if(!showingLiveData) updatePage(result.data);
  return true;
});

liveDataFetched.then(function(fetched){
  return fetched || cachedDataFetched;
}).then(function(){
  hideSpinner();
});

//Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    console.log('ServiceWorker registration failed: ', err);
  });
}


function hideSpinner() {
  refreshButton.classList.remove('loading');
}

function getGifsData(searchTerm) {
  return giphy.search(searchTerm, {
    headers: {}
  }).catch(function(){
    return null;
  });
}

function getCachedGifsData(searchTerm) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return giphy.search(searchTerm, {
      headers: {'x-use-cache-only': '1'}
    }).catch(function() {
      return null;
    });
  }
  else {
    return Promise.resolve(null);
  }
}

function updatePage(data) {
  photosEl.insertBefore(utils.strToEls(photosTemplate(data)), photosEl.firstChild);
}