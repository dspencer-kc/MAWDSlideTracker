var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')

module.exports = {
  querySlideLocation: querySlideLocation,
  pullSlidesWithStorageDetails: pullSlidesWithStorageDetails
}

function querySlideLocation (request, response, callback) {
//= ==========================================================================================
//
//    Function xxx
//      xxx
//
//    Author: Drew Spencer
//
//
//    When to call:
//      xxx
//= ===========================================================================================
var strUserID = request.body.slideid

var strSQL = `SELECT * FROM OPENLIS.tblslidestorage
            WHERE \`slide_id\` = '` + slideid + `';`

console.log(strSQL)

// Connect to the database
var con = mysql.createConnection(mysqlConfig)
console.log('Connected!')

con.query(strSQL, function (err, result) {
    if (err) {
    console.log(err)
    } else {
    console.log('Completed query.')
    console.log(result)
    response.json(result)
    }
    con.end()
}) // End query
}

function pullSlidesWithStorageDetails (request, response, callback) {
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
  let urlParts = url.parse(request.url, true)
  let strAccessionID = request.body.accessionid

// SELECT * FROM OPENLIS.tblSlides where BlockID = "D18-99999_B_1";
// strSQL = `SELECT * FROM OPENLIS.tblSlides where BlockID = '${strBlockID}';`;
var strSQL = `
SELECT s.AccessionID,
s.PartDesignator,
s.BlockDesignator,
s.Patient,
s.StainLabel,
s.SlideInst,
s.slidecount,
s.SiteLabel,
s.SlideID,
ss.slidestoragestatus,
ss.slidelocationid,
ss.slideowner,
ss.updateddatetime,
ss.CanBeRequested
FROM   tblSlides as s
  LEFT JOIN tblslidestorage as ss
  on s.SlideID = ss.SlideID
WHERE  (( ( s.AccessionID ) = '${strAccessionID}' ));`
console.log(strSQL)

  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.log(err)
    } else {
    // if there is no error, you have the result
    // iterate for all the rows in result
    Object.keys(result).forEach(function (key) {
        var row = result[key]
        // Format Date
        row.updateddatetime = dateFormat(row.updateddatetime, 'mm/dd/yyyy h:MM:ss TT')
    })

    // console.log(result)
    response.json(result)
    }
    con.end()
})
// });
// con.end();
console.log(`Inquire storage on ${strAccessionID}`)
}