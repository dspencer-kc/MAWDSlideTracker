

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

module.exports = {
    init,
    get_comm
}

 function init (comport) {
    return new Promise((resolve) => {
        resolve(new SerialPort(comport).pipe(new Readline({ delimiter: '\r\n' })))
    })
}

 function get_comm() {
    return new Promise((resolve, reject) => {
        SerialPort.list(function (err, ports) {
            ports.forEach(function (port) {
                console.info("Scanning Ports..\n")
                console.info(port['comName'], ' ', port['manufacturer'], ' ', port['serialNumber'],'\n')
                if (port['manufacturer'] == 'Zebra Technologies Corp') {
                    resolve({error: false, port: port['comName']})
                }
            })
            reject({error: true, msg: 'no port found'})
        })
    })
}