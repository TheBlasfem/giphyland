var giphy = require('./giphy');
var photosEl = document.querySelector('.photos');
var utils = require('./utils');
var photosTemplate = require('./views/photos.hbs');

//Initial Load
var liveDataFetched = getGifsData('cats').then(function(result) {
  if (!result) return false;
  console.log(result.data[0]);
  updatePage(result.data);
  return true;
});

//Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
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