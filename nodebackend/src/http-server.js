

const fastify = require('fastify')()
const express = require('express')
const router = require('express').Router()


const path = require('path');
const bodyParser = require('body-parser')
const morgan = require('morgan')

const ST = require('./slide-tracking/slide-tracker')
const STFunc = Object.keys(ST)
const STR = require('./slide-tracking/reports')
const STRFunc = Object.keys(STR)
const STCB = require('./slide-tracking/CaseBlockSlideCount.js')
const STCBFunc = Object.keys(STCB);

const version = '4.1'

router.use(morgan('dev'));

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(express.static('dist'))

router.use('/slidetracker', router)

router.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Cache-Control', 'max-age=0')
  if ('OPTIONS' === req.method) {
    console.log('\n')
    console.info('Route Requested: '+req.url.substring(1))
    res.sendStatus(200);
  }else{
    next()
  }
})

router.use(function (req, res) { //Check if requested route is in:
  const route = req.url.substring(1)
  console.log('\n')
  console.info('Route Requested: '+route)
  if (STFunc.includes(route)) {           //SlideTracker Routes
    ST[route](req, res);
  }else if (STRFunc.includes(route)) {    //SlideTrackerReport Routes
    STR[route](req, res);
  }else if (STCBFunc.includes(route)) {   //SlideTrackerCaseBlock Routes
    STCB[route](req, res);
  }else if (route === 'getVersion'){      //Get Backend Version
    res.send(version)
  }else if (route === ''){                 //host frontend vue
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }else{                                   //No Route Found
    console.error("NO ROUTE FOUND: "+route)
  }
})

fastify.register(require('fastify-express'))
    .after(() => {fastify.use(router)})

module.exports = {
  start
}

 function start (port) {
  fastify.listen(port, () => console.log(`Listening on port ${port}`))
}