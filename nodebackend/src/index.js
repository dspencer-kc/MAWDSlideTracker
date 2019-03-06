//= ==========================================================================================
//
//    File: src/index.js
//
//    **This will eventually be the entry point once logic from original index.js is migrated
//      here.
//
//= ===========================================================================================

var httpServer = require('./http-server')

httpServer.start(3000, function (err, message) {
  if (err) console.log(err)
  console.log(message)
  // server sends some data in the callback to display maybe
})
