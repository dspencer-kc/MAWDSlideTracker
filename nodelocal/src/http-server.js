var http = require("http")


module.exports = {
  start: start
}

function start (callback) {
  // start the http server up here
  var server = http.createServer(function(request, response){
  })

  return server
}
