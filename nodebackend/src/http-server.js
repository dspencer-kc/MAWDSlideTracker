const express = require('express')
const app = express()
const router = express.Router()
var bodyParser = require('body-parser')
var slideTracker = require('./slide-tracking/slide-tracker')
var slideTrackerReports = require('./slide-tracking/reports')
var slideTrackerCaseBlockSlideCounts = require('./slide-tracking/CaseBlockSlideCount.js')

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

app.post('/getpartblockcurrentandtotals', function (request, response) {
  slideTracker.getPartBlockCurrentAndTotals(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/updateslidetoprint', function (request, response) {
  slideTracker.updateSlideToPrint(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/printslides', function (request, response) {
  slideTracker.printSlides(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/histodata', function (request, response) {
  slideTracker.histodata(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/slidedistribution', function (request, response) {
  slideTracker.slideDistribution(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/reports', function (request, response) {
  slideTrackerReports.reports(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

// all routes prefixed with /slidetracker
app.use('/slidetracker', router)
console.log('Slide Tracker Default Route')
// using router.get() to prefix our path
// url: http://localhost:3000/slidetracker/
router.get('/', (request, response) => {
  console.log('router.get')
  response.json({ message: 'Hello from the API' })
})

router.get('/slideparameters', (request, response) => {
  slideTracker.pullSlides(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/caseblockslidecount', (request, response) => {
  slideTrackerCaseBlockSlideCounts.caseblockslidecount(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

app.post('/caseblockslidecountdetails', (request, response) => {
  slideTrackerCaseBlockSlideCounts.caseblockslidecountdetails(request, response, function (err, message) {
    if (err) return console.log(err)
    console.log(message)
  })
})

module.exports = {
  start: start
}

function start (port, callback) {
  // set the server to listen on port XXXX
  server = app.listen(port, () => console.log(`Listening on port ${port}`))
}
