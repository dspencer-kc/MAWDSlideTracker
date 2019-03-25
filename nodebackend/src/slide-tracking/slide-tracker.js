var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')



module.exports = {
  printSlides: printSlides,
  getSlideParameters: getSlideParameters,
  getUserInfo: getUserInfo,
  updateSlideToPrint: updateSlideToPrint
}

function printSlides (request, response, callback) {
  // print the slides here
}

function getSlideParameters (request, response, callback) {
  // get some slide parameters here
}

function getUserInfo (request, response, callback) {
  var strResponse = ''
  var strUserID = request.body.userid

  var strSQL = "SELECT * FROM OPENLIS.tblUsers \
              WHERE `id` = '" + strUserID + "';"

  console.log(strSQL)

  // Connect to the database
  var con = mysql.createConnection(mysqlConfig)
  console.log('Connected!')

  con.query(strSQL, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log('Completed query.')
      Object.keys(result).forEach(function (key) {
        var row = result[key]
        // Format Date
      })
      console.log(result)
      response.json(result)
    }
    con.end()
  }) //End query
}

function updateSlideToPrint (request, response, callback) {
  // update slide to print here test
}
