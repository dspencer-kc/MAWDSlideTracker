var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
// const url = require('url')
// var dateFormat = require('dateformat')
// var fs = require('fs')

module.exports = {

  reports: reports
}

function reports (request, response, callback) {
// ===========================================================================================
//    Reports
// ============================================================================================

  console.log('reports start')
  let strReportName = request.body.action
  let strSQL = null

  console.log(strReportName)

  // Set SQL based on action
  switch (strReportName) {
    case 'blockcount':
      // console.log('Hello report block count')

      strSQL = `/* qryTotalBlockCountWSort
      Total Block Count: Previous Busines Day Plus Hours set from tbleRunTime 'PreviousDayCutoff*/
      SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
      FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
              FROM tblSlides as subTblSlides
              INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
              WHERE subTblSlideDistribution.DTReadyForCourier > funPreviousWorkDayCutoffDateTime()
              GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
      INNER JOIN tblSlideDistributionLocations on SlideDistributionLocation = tblSlideDistributionLocations.LocationID
      GROUP BY SlideDistributionLocation
      ORDER BY tblSlideDistributionLocations.SortValue;`
      break

    case 'BlockCountAllRunTimesBySortVal':
      // console.log('Hello report block count')

      strSQL = `/*qryBlockCountAllRunTimesBySortVal*/
      SELECT 
        LocAbbr,
        FirstRunBlockCount,
        SecondRunBlockCount,
        ThirdRunBlockCount,
        FourthRunBlockCount,
        TotalBlockCount
      FROM
        qryBlockCountAllRunTimesBySortVal;`
      break

    default:
      break
  }
  //  console.log(strSQL)

  if (strSQL !== null) {
  // Connect to the database
    var con = mysql.createConnection(mysqlConfig)
    con.query(strSQL, function (err, result) {
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
}
