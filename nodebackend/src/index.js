
require('dotenv').load()
require('console-info');
require('console-warn');
require('console-error');
var httpServer = require('./http-server')
var port = process.env.HttpPort

httpServer.start(port, function (err, message) {
  if (err) console.error(err)
  console.log(message)
})
