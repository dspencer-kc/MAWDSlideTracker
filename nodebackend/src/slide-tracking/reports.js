var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')

export function reports (request, response, callback) {

  let strReportName = request.body.action
  let strSQL = null

  switch (strReportName) {
    case 'blockcount':

      strSQL = `/* qryTotalBlockCountWSort
      Total Block Count: Previous Busines Day Plus Hours set from tbleRunTime 'PreviousDayCutoff*/
      SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
      FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
              FROM tblSlides as subTblSlides
                       INNER JOIN tblSlideDistribution as subTblSlideDistribution
                                  on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
              WHERE subTblSlideDistribution.DTReadyForCourier >
                    date_format(curdate() - if(weekday(curdate()) >= 5, if(weekday(curdate()) = 6, 2, 1), 1),
                                '%Y-%m-%d 18:00:00')
              GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
      INNER JOIN tblSlideDistributionLocations on SlideDistributionLocation = tblSlideDistributionLocations.LocationID
      GROUP BY SlideDistributionLocation
      ORDER BY tblSlideDistributionLocations.SortValue;`
      break

    case 'BlockCountAllRunTimesBySortVal':

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

  if (strSQL !== null) {
    var con = mysql.createConnection(mysqlConfig)
    con.query(strSQL, function (err, result) {
      if (err) {
        response.send(err)
        console.error(err)
      } else {
        response.json(result)
      }
      con.end()
    })
  }
}
