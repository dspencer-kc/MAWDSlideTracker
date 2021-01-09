var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')

module.exports = {
querySlideLocation: querySlideLocation
}

function querySlideLocation (request, response, callback) {
//= ==========================================================================================
//
//    Function getUserInfo
//      Get User Info
//
//    Author: Drew Spencer
//
//
//    When to call:
//      To get userinfo based on badge barcode
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
var urlParts = url.parse(request.url, true)
var parameters = urlParts.query
var strAccessionID = parameters.accessionid

// SELECT * FROM OPENLIS.tblSlides where BlockID = "D18-99999_B_1";
// strSQL = `SELECT * FROM OPENLIS.tblSlides where BlockID = '${strBlockID}';`;
var strSQL = `SELECT tblSlides.AccessionID,
tblSlides.PartDesignator,
tblSlides.BlockDesignator,
tblSlides.Patient,
tblSlides.StainLabel,
tblSlides.ToBePrinted,
tblSlides.SlideInst,
tblSlides.slidecount,
tblSlides.StainOrderDate,
tblSlides.SiteLabel,
tblSlides.SlideID,
tblSlides.Status
FROM   tblSlides  
WHERE  (( ( tblSlides.BlockID ) = '${strBlockID}' )); `
// console.log(strSQL)

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
        row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
        if (row.OrderingPath === 'null') {
        row.OrderingPath = ''
        }
    })

    // console.log(result)
    response.json(result)
    }
    con.end()
})
// });
// con.end();
console.log(`${strBlockID}`)
}