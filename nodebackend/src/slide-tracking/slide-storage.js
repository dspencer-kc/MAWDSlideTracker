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