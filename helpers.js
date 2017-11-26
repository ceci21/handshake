let helpers = {};

helpers.post = function(endpoint, data, callback) {
  console.log('Data in post function: ', data);
  let options = { 
    method: 'POST',
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(endpoint, options).then(callback);
};

helpers.get = function(endpoint, callback) {
  let myHeaders = new Headers();
  let options = { 
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
  }
  fetch(endpoint, options).then(callback);
};

module.exports = helpers;