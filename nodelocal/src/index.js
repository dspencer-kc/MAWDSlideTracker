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
let connectCounter=0;

get_comm()
    .then(data => {init(data['port'])
    .then(parse => {parser = parse;console.info("Found Scanner!\n");})
}).catch(()=>
    {
    console.error("!!!NO SCANNER FOUND!!!")
    process.exit()
    }
)

io.on('connection', function (socket) {
  connectCounter++;
  if(connectCounter>1){console.error('!!TOO MANY CONNECTIONS!!')}
  else{ console.warn('socket.io connected on ', socketport)}

  parser.on('data', function (data) {
      let blockType = {HBLK:'Block',HSLD:'Slide',LOCN:'Location',SLTR:'Slide Tray',SBDG:'Badge'}
      console.info(blockType[data.substr(0,4)],'Scanned: ',data,'\n')
      io.emit('stream', {
      barcodeScanData: data,
      stationName: strStationName,
      slideQueuePath: strSlideQueuePath
    })
  })
})

io.on('disconnect', function() {
    connectCounter--;
    console.log("disconnected")});


