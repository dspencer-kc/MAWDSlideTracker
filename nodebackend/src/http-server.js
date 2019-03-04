const express = require('express')
const app = express()
var bodyParser = require('body-parser')

var slideTracker = require('./slide-tracking/slide-tracker')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.post('/getuserinfo', function (request, response) {
  slideTracker.getUserInfo(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

module.exports = {
  start: start
}

function start (port, callback) {
  // start the express server up here
}
