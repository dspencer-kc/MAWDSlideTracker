var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')

module.exports = {

  caseinquiry: caseinquiry
}

function caseinquiry (request, response, callback) {
  let strAPISecret = null
  let strStrAccessionID = null
  let strUnsanitizedSQL = null
  let arSQLInserts = null
  let strSanitizedSQL = null

  strAPISecret = request.body.apitoken

  if (strAPISecret === process.env.APItoken) {
    strStrAccessionID = request.body.ACCESSIONID
    console.log(strStrAccessionID)

    strUnsanitizedSQL = `/*qryCaseInquiry*/
      SELECT tblSlides.SlideID, 
              tblSlides.StainLabel, 
              tblSlideDistribution.Status, 
              tblSlideDistribution.SlideDistributionLocation, 
              tblSlideDistribution.DTReadyForCourier, 
              tblSlides.LocationPrinted, 
              tblSlides.DTPrinted, 
              tblSlides.StainOrderDate, 
              tblSlideDistribution.SlideTray,
              tblBlock.DateTimeEngraved
      FROM   (tblSlides 
              LEFT JOIN tblSlideDistribution 
                      ON tblSlides.SlideDistributionID = 
                        tblSlideDistribution.SlideDistributionID) 
              LEFT JOIN tblBlock 
                    ON tblSlides.BlockID = tblBlock.BlockID 
      WHERE  (( ( tblSlides.AccessionID ) = ? ));`

    // Sanitized Params
    arSQLInserts = [strStrAccessionID]
    strSanitizedSQL = mysql.format(strUnsanitizedSQL, arSQLInserts)
    console.log(strSanitizedSQL)
    if (strSanitizedSQL !== null) {
      // Connect to the database
      var con = mysql.createConnection(mysqlConfig)
      con.query(strSanitizedSQL, function (err, result) {
        if (err) {
          response.send(err)
          console.log(err)
        // On Error, close connection
        } else {
        // if there is no error, you have the result
          response.json(result)
        }
        con.end()
      })
    }
  } else {
    response.send('Unknown Error')
  }
}
