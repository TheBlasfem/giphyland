var giphy = require('./giphy');


getGifsData('cats').then(function(data){
  console.log(data);
});

function getGifsData(searchTerm) {
  return giphy.search(searchTerm, {
    headers: {}
  }).catch(function(){
    return null;
  });
}