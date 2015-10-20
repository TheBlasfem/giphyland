window.Promise = window.Promise || require('es6-promise').Promise;
require('whatwg-fetch');

var giphy = require('./giphy');
var photosEl = document.querySelector('.photos');
var utils = require('./utils');
var photosTemplate = require('./views/photos.hbs');
var refreshButton = document.querySelector('button.refresh');

//Initial Load
var liveDataFetched = getGifsData('cats').then(function(result) {
  if (!result) return false;
  updatePage(result.data);
  return true;
});

liveDataFetched.then(function(){
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

function updatePage(data) {
  photosEl.insertBefore(utils.strToEls(photosTemplate(data)), photosEl.firstChild);
}