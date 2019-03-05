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
}

function updateSlideToPrint (request, response, callback) {
  // update slide to print here test
}
