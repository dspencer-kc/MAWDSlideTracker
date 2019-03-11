
//= ==========================================================================================
//
//    File: index.js
//
//    **This file will go away once src\index.js is used
//
//    Authors: Drew Spencer, Jami Shelton
//
//    Description: This is our main node file which runs all the API's for the vue frontend to call.
//    Currently this is ran locally on the computers running the slide tracker.  Eventually
//    to interface with the local hardware such as barcode scanners, node will need to be ran
//    locally, but pieces of this, especially the API's, will be designed to run on a server.
//
//    Notes: Working towards StandardJS.  We are still in beta testing.
//= ===========================================================================================

require('dotenv').load()
var fs = require('fs')
var bodyParser = require('body-parser')
var strSlideQueuePath = '\\\\mawd-data01\\slideprinters\\slidequeue\\histo1\\'  //DefaultPath if not assigned when passed
var dateFormat = require('dateformat')
var strFileWriteData = ''
// var strSlideFlatFileName = ''
const express = require('express')
var mysql = require('mysql')
const app = express()
const router = express.Router()
const port = 3000

var strMYSQLHost = process.env.strMYSQLHost
var strMYSQLUser = process.env.strMYSQLUser
var strMYSQLPassword = process.env.strMYSQLPassword
var strMYSQLDB = process.env.strMYSQLDB
var strSQL = ''
// var arSlideCount = []
//var barcodeScan = require('./src/barcode/barcode-scan.js')
//barcodeScan.init('COM4', io)

// Connect to the database
var con = mysql.createConnection({
  host: strMYSQLHost,
  user: strMYSQLUser,
  password: strMYSQLPassword,
  database: strMYSQLDB
})

con.connect(function (err) {
  if (err) {
    response.send(err)
    throw err
  }
})

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect

  res.setHeader('Access-Control-Allow-Origin', '*')
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next()
})

//= ==========================================================================================
//
//    app.post updateslidetoprint
//      Update Slide To Print
//
//    Author: Drew Spencer
//
//    Last edited: 12/21/2018 ds
//
//    When to call:
//      Anytime a slide is checked or uncheck to print
//    Purpose:
//      Updated the database that a slide needs to be printed, or does not need to be printed.
//= ===========================================================================================
app.post('/updateslidetoprint', function (request, response) {
  var strResponse = ''
  var strAction = request.body.action
  var strSlideID = request.body.slideId
  var blToPrintStatus = request.body.toPrintStatus

  var strSQL = 'UPDATE `OPENLIS`.`tblSlides` ' +
            'SET ' +
                ' `ToBePrinted` = ' + blToPrintStatus +
            ' WHERE `SlideID` = \'' + strSlideID + '\';'
console.log(strSQL)
  //Update caused error
  //var strSQL = 'UPDATE `OPENLIS`.`tblSlides` ' +
  //            'SET `ToBePrinted` = \'' + blToPrintStatus + '\' ' +
  //            'WHERE `SlideID` = \'' + strSlideID + '\';'
 

  // con.connect(function(err)
  // {
  //  if (err)
  //  {
  //    response.send(err);
  //    throw err;
  //  }
  console.log('Connected!')

  //
  con.query(strSQL, function (err, result) {
    if (err) {
      response.send(err)
      console.log(err)
      throw err
      // On Error, close connection
    }
    // if there is no error, you have the result
    strResponse = result.affectedRows + ' record(s) updated'
    console.log(strResponse)
  })
  // });

  console.log(strSlideID)
  console.log(blToPrintStatus)
  console.log(strAction)
  response.send('OK')
})

//= ==========================================================================================
//
//    app.post getUserInfo
//      Get User Info
//
//    Author: Drew Spencer
//
//    Last edited: 1/8/2019 by Jami
//
//    When to call:
//      To get userinfo based on badge barcode
//= ===========================================================================================
app.post('/getuserinfo', function (request, response) {
  var strResponse = ''
  var strUserID = request.body.userid

  var strSQL = "SELECT * FROM OPENLIS.tblUsers \
              WHERE `id` = '" + strUserID + "';"

  console.log(strSQL)
  // Connect to database
  // var con = mysql.createConnection({
  //  host: strMYSQLHost,
  //  user: strMYSQLUser,
  //  password: strMYSQLPassword,
  //  database: strMYSQLDB
  // });

  // con.connect(function(err)
  // {
  //  if (err) throw err;
  console.log('Connected!')

  con.query(strSQL, function (err, result) {
    if (err) throw err
    // if there is no error, you have the result
    // iterate for all the rows in result

    console.log('Completed query.')
    Object.keys(result).forEach(function (key) {
      var row = result[key]
      // Format Date
    })

    console.log(result)
    response.json(result)
  })
  // });
})

//= ==========================================================================================
//
//    app.post printslides
//      Prints Slides and updates tracking info
//
//    Author: Drew Spencer
//
//    Last edited: 12/21/2018 ds
//
//    When to call:
//      AFter you know the blockid and you are ready to print a slide
//    Purpose:
//      Looks up all of the slide information from database and generates flat file to specific
//      folder to print slide.
//
//    Paremeters:
//        strBLockID:  id of block to print Slides
//        strPrintRequestBy:  id of person printing slided - **Not Implemented Yet**
//        strAction:  Not used, needs to be removed
//
//
//= ===========================================================================================

app.post('/printslides', function (request, response) {
// var strPrintRequestBy = "unknown";

console.log(request)
  var strLocationID = 'unknown'
  var strSQLUpdateStatement = ''

  var strDate
  strDate = new Date().toLocaleString()

  var strAction = request.body.action
  var strBlockID = request.body.blockID
  var strPrintRequestBy = request.body.printRequestedBy
  strSlideQueuePath = request.body.slideQueuePath

  console.log('Hello PrintSlides')
  console.log(strBlockID)
  console.log(strAction) // strAction is not used
  console.log(strPrintRequestBy)
  console.log(strDate)
  console.log('Slidequeuepath:', strSlideQueuePath)


  // Get all required information from blockID, only include slides that are marked 'to be printed'
  strSQL = `SELECT tblSlides.*, \
                     tblCassetteColorHopperLookup.Color   AS SlideDistributionKeyword, \
                     copath_c_d_stainstatus.name          AS CopathStainOrderStatus, \
                     copath_c_d_person_1.initials         AS OrderPathInitials, \
                     copath_c_d_person_1.prettyprint_name AS OrderingPathName, \
                     copath_c_d_person_1.prettyprint_name AS CopathStainOrderStatusUpdatedBy, \
                     copath_c_d_department.name           AS StainDept  \
                FROM   ((((((tblSlides \
                         INNER JOIN copath_p_stainprocess \
                                 ON tblSlides.BlockStainInstID = \
                                    copath_p_stainprocess._blockstaininstid) \
                        INNER JOIN tblBlock  \
                                ON tblSlides.BlockID = tblBlock.BlockID)  \
                       LEFT JOIN tblCassetteColorHopperLookup  \
                              ON tblBlock.Hopper = tblCassetteColorHopperLookup.HopperID) \
                      LEFT JOIN copath_c_d_stainstatus \
                             ON copath_p_stainprocess.stainstatus_id = \
                                copath_c_d_stainstatus.id) \
                     LEFT JOIN copath_c_d_person \
                            ON copath_p_stainprocess.status_who_id = copath_c_d_person.id) \
                    LEFT JOIN copath_c_d_person AS copath_c_d_person_1 \
                           ON copath_p_stainprocess.orderedby_id = copath_c_d_person_1.id) \
                   LEFT JOIN copath_c_d_department \
                          ON copath_p_stainprocess.wkdept_id = copath_c_d_department.id \
                WHERE  (( ( tblSlides.BlockID ) = '${strBlockID}') AND  tblSlides.ToBePrinted = TRUE );`

  console.log(strSQL)
  console.log('Connected!')

  con.query(strSQL, function (err, result) {
    if (err) throw err
    // if there is no error, you have the result
    // iterate for all the rows in result
    Object.keys(result).forEach(function (key) {
      var row = result[key]
      // Format Date
      row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
      if (row.OrderingPath = 'null') {
        row.OrderingPath = ''
      }

      var d = new Date().toLocaleDateString()
      fileDate = d.replace(/-|\//g, '')

      // WriteSlideData
      // SlideID|AccessionID|SlideInst|PartDesignator|BlockDesignator|StainOrderDate|OrderingPath|Patient|SiteLabel|SlideDistributionKeyword|StainLabel
      strFileWriteData = row.SlideID + '|' + row.AccessionID + '|' + row.SlideInst + '|' + row.PartDesignator + '|' + row.BlockDesignator + '|' + row.StainOrderDate + '|' + row.OrderingPath + '|' + row.Patient + '|' + row.SiteLabel + '|' + row.SlideDistributionKeyword + '|' + row.StainLabel

      strSlideFlatFileFullName = strSlideQueuePath + row.SlideID + '_' + fileDate + '.txt'
      console.log(strSlideFlatFileFullName)
      fs.writeFile(strSlideFlatFileFullName, strFileWriteData,
        // callback function that is called after writing file is done
        function (err) {
          if (err) throw err
          // if no error
          console.log('Data is written to ' + strSlideFlatFileFullName.toString())
        })

      // Update query to say slide has been printed
      strSQLUpdateStatement = "UPDATE `OPENLIS`.`tblSlides` \
                                                  SET \
                                                      `Status` = 'Printed',\
                                                      `Printed` = TRUE,\
                                                      `DateTimePrinted` = '" + strDate + "',\
                                                      `LocationPrinted` = '" + strLocationID + "',\
                                                      `WhoPrinted` = '" + strPrintRequestBy + "',\
                                                      `TimesPrinted` = `TimesPrinted` + 1,\
                                                      `Audit` = CONCAT(`Audit`,\
                                                              ' Slide Printed " + strDate + ' at ' + strLocationID + ' by ' + strPrintRequestBy + ".'),\
                                                      `ToBePrinted` = FALSE\
                                                  WHERE\
                                                      `SlideID` = '" + row.SlideID + "';"

      con.query(strSQLUpdateStatement, function (updateerr, updateresult) {
        if (updateerr) throw updateerr

        console.log(strSQLUpdateStatement)
        console.log(updateresult.affectedRows + ' record(s) updated')
      })
    })

    console.log(result)
  })

  console.log(`${strBlockID}`)
  response.send('Slides have been sent to Slide Printer')
})

//= ==========================================================================================
//
//    app.post pullslides
//      Pull Slides Info by blockid - converted to post from get
//
//    Author: Drew Spencer
//
//    Last edited: 3/11/2019
//
//    When to call:
//      AFter block is scanned
//= ===========================================================================================
app.post('/pullslides', function (request, response) {

    var strResponse = ''
    var strUserID = request.body.userID
    var strBlockID = request.body.blockID

    console.log('pullslides api call start')

    // Connect to database
    // var con = mysql.createConnection({
    //  host: strMYSQLHost,
    //  user: strMYSQLUser,
    //  password: strMYSQLPassword,
    //  database: strMYSQLDB
    // });

    // SELECT * FROM OPENLIS.tblSlides where BlockID = "D18-99999_B_1";
    // strSQL = `SELECT * FROM OPENLIS.tblSlides where BlockID = '${strBlockID}';`;
    strSQL = `SELECT tblSlides.*, \
                       tblCassetteColorHopperLookup.Color   AS SlideDistributionKeyword, \
                       copath_c_d_stainstatus.name          AS CopathStainOrderStatus, \
                       copath_c_d_person_1.initials         AS OrderPathInitials, \
                       copath_c_d_person_1.prettyprint_name AS OrderingPathName, \
                       copath_c_d_person_1.prettyprint_name AS CopathStainOrderStatusUpdatedBy, \
                       copath_c_d_department.name           AS StainDept  \
                  FROM   ((((((tblSlides \
                           INNER JOIN copath_p_stainprocess \
                                   ON tblSlides.BlockStainInstID = \
                                      copath_p_stainprocess._blockstaininstid) \
                          INNER JOIN tblBlock  \
                                  ON tblSlides.BlockID = tblBlock.BlockID)  \
                         LEFT JOIN tblCassetteColorHopperLookup  \
                                ON tblBlock.Hopper = tblCassetteColorHopperLookup.HopperID) \
                        LEFT JOIN copath_c_d_stainstatus \
                               ON copath_p_stainprocess.stainstatus_id = \
                                  copath_c_d_stainstatus.id) \
                       LEFT JOIN copath_c_d_person \
                              ON copath_p_stainprocess.status_who_id = copath_c_d_person.id) \
                      LEFT JOIN copath_c_d_person AS copath_c_d_person_1 \
                             ON copath_p_stainprocess.orderedby_id = copath_c_d_person_1.id) \
                     LEFT JOIN copath_c_d_department \
                            ON copath_p_stainprocess.wkdept_id = copath_c_d_department.id \
                  WHERE  (( ( tblSlides.BlockID ) = '${strBlockID}'));`
    console.log(strSQL)
    con.query(strSQL, function (err, result) {
      if (err) throw err
      // if there is no error, you have the result
      // iterate for all the rows in result
      Object.keys(result).forEach(function (key) {
        var row = result[key]
        // Format Date
        row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
        if (row.OrderingPath = 'null') {
          row.OrderingPath = ''
        }
      })

      console.log(result)
      response.json(result)
    })
  })

//= ==========================================================================================
//
//    app.get slidetracker
//
//    Used to lookup slides by BlockID
//
//    Author: Drew Spencer
//
//    Last edited: 12/21/2018 ds
//
//    When to call:
//      After tech scans blockID
//
//    Purpose:
//      Pulls all pending slides for block
//
//    Paremeters:  **Paremeters are in URL through get
//        strBLockID:  id of block to print Slides
//
//    Returns:    JSON with all slide information
//
//= ===========================================================================================

// all routes prefixed with /slidetracker
app.use('/slidetracker', router)

// using router.get() to prefix our path
// url: http://localhost:3000/slidetracker/
router.get('/', (request, response) => {
  response.json({ message: 'Hello from the API' })
})

// set the server to listen on port 3000
server = app.listen(port, () => console.log(`Listening on port ${port}`))

const url = require('url')

// Get used to return slide information
router.get('/slideparameters', (request, response) => {
  var urlParts = url.parse(request.url, true)
  var parameters = urlParts.query
  var strBlockID = parameters.blockid

  // Connect to database
  // var con = mysql.createConnection({
  //  host: strMYSQLHost,
  //  user: strMYSQLUser,
  //  password: strMYSQLPassword,
  //  database: strMYSQLDB
  // });

  // SELECT * FROM OPENLIS.tblSlides where BlockID = "D18-99999_B_1";
  // strSQL = `SELECT * FROM OPENLIS.tblSlides where BlockID = '${strBlockID}';`;
  strSQL = `SELECT tblSlides.*, \
                     tblCassetteColorHopperLookup.Color   AS SlideDistributionKeyword, \
                     copath_c_d_stainstatus.name          AS CopathStainOrderStatus, \
                     copath_c_d_person_1.initials         AS OrderPathInitials, \
                     copath_c_d_person_1.prettyprint_name AS OrderingPathName, \
                     copath_c_d_person_1.prettyprint_name AS CopathStainOrderStatusUpdatedBy, \
                     copath_c_d_department.name           AS StainDept  \
                FROM   ((((((tblSlides \
                         INNER JOIN copath_p_stainprocess \
                                 ON tblSlides.BlockStainInstID = \
                                    copath_p_stainprocess._blockstaininstid) \
                        INNER JOIN tblBlock  \
                                ON tblSlides.BlockID = tblBlock.BlockID)  \
                       LEFT JOIN tblCassetteColorHopperLookup  \
                              ON tblBlock.Hopper = tblCassetteColorHopperLookup.HopperID) \
                      LEFT JOIN copath_c_d_stainstatus \
                             ON copath_p_stainprocess.stainstatus_id = \
                                copath_c_d_stainstatus.id) \
                     LEFT JOIN copath_c_d_person \
                            ON copath_p_stainprocess.status_who_id = copath_c_d_person.id) \
                    LEFT JOIN copath_c_d_person AS copath_c_d_person_1 \
                           ON copath_p_stainprocess.orderedby_id = copath_c_d_person_1.id) \
                   LEFT JOIN copath_c_d_department \
                          ON copath_p_stainprocess.wkdept_id = copath_c_d_department.id \
                WHERE  (( ( tblSlides.BlockID ) = '${strBlockID}'));`
  console.log(strSQL)

  con.query(strSQL, function (err, result) {
    if (err) throw err
    // if there is no error, you have the result
    // iterate for all the rows in result
    Object.keys(result).forEach(function (key) {
      var row = result[key]
      // Format Date
      row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
      if (row.OrderingPath = 'null') {
        row.OrderingPath = ''
      }
    })

    console.log(result)
    response.json(result)
  })
  // });
  // con.end();
  console.log(`${strBlockID}`)



})
