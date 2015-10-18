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