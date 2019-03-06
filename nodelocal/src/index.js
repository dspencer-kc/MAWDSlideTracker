var barcodeScan = require('./barcode/barcode-scan')
var httpServer = require('./http-server')
barcodeScan.init('COM4')
const socketport = '8001'

//Start http server
server = httpServer.start(function (err, message) {
  if (err) console.log(err)
  console.log(message)
  // server sends some data in the callback to display maybe
})

//Load websockets
var io = require('socket.io').listen(server)
server.listen(socketport)
console.log('http server created and listening on ', socketport)


//Socket connected event fired
io.sockets.on('connection', function(socket){
  console.log('socket.io connected on ', socketport)

    //Barcode scan event fired
    parser.on('data', function(data) {
      console.log('Barcode scan detected')
      console.log('Data:  ', data)
      //socket.emit('stream', {'title': data})
      socket.emit('stream', {data})
    })
});
