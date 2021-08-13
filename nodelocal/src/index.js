require('dotenv').config({path: './src/.env'})
require('console-info');
require('console-warn');
require('console-error');

let strSlideQueuePath = process.env.SlideQueuePath
let strStationName = process.env.StationName
let socketport = process.env.WebSocketPort

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http).listen(socketport);

const {get_comm, init} = require("./barcode/barcode-scan");
let parser = ''

get_comm()
    .then(data => {init(data['port'])
    .then(parse => {parser = parse})
    .then(()=>console.info("Found Scanner!\n"))
}).catch(()=>
    {
    console.error("!!!NO SCANNER FOUND!!!")
    process.exit()
    }
)

io.on('connection', function (socket) {
  console.warn('socket.io connected on ', socketport)
  parser.on('data', function (data) {
    console.info('Barcode scan detected')
    console.info('Data:  ', data,'\n')
      socket.emit('stream', {
      barcodeScanData: data,
      stationName: strStationName,
      slideQueuePath: strSlideQueuePath
    })
  })
})
