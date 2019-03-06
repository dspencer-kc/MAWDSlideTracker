const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

module.exports = {
    init: function (comport) {
        //Set up port
        port = new SerialPort(comport, function (err) {
            if (err) {
              return console.log('Error: ', err.message)
            }
        })

        //Set up parser
        parser = port.pipe(new Readline({ delimiter: '\r\n' }))
        console.log('Listening for scans on: ' + comport + ' scan event will not trigger unless socket.io connection event has occurred.')
    }
}
