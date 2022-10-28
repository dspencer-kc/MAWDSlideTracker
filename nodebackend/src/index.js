//= ==========================================================================================
//
//    File: src/index.js
//
//    **This will eventually be the entry point once logic from original index.js is migrated
//      here.
//
//= ===========================================================================================
require('dotenv').load()
var httpServer = require('./http-server')
var port = process.env.HttpPort

httpServer.start(port, function (err, message) {
  if (err) console.log(err)
  console.log(message)
  // server sends some data in the callback to display maybe
})
