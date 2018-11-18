const request = require('request');

module.exports = (db) => {
  (req, res) => {

    request((error, queryResponse, body) => {
      console.log('error:', error); // Print the error if one occurred and handle it
      console.log('statusCode:', queryResponse && queryResponse.statusCode); // Print the response status code if a response was received

      res.send(body);
    });
  },
}