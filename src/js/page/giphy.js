var utils = require('./utils');
var apiKey = 'dc6zaTOxFJmzC';
var apiUrl = 'https://api.giphy.com/v1/';

function search(text, opts) {
  var params = {
    fmt: 'json',
    api_key: apiKey,
    q: text
  };

  return fetch(apiUrl + 'gifs/search?' + utils.toQuerystring(params), opts).then(function(response){
    return response.json();
  });
}

module.exports.search = search;
