var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')

module.exports = {

  caseblockslidecount: caseblockslidecount
}

function caseblockslidecount (request, response, callback) {
  // ===========================================================================================
  //    Case Block Slide Count
  // ============================================================================================

  console.log('caseblockslidecount')
  let strURLHash = null
  //  let strSlideDistributionLocation = ''
  let strSlideDistributionLocation = 'LOCNDERM'
  let strSQL = null
  let strLocnIDLookupSQL = null
  strURLHash = request.body.URLHash

  //  MySQL Call to get location id based off of hash
  if (strURLHash !== null) {
    strLocnIDLookupSQL = `SELECT LocationID FROM OPENLIS.tblSlideDistributionLocations where URLHash = '${strURLHash}';`

    // Connect to the database
    var conLocnIDLookup = mysql.createConnection(mysqlConfig)
    conLocnIDLookup.query(strLocnIDLookupSQL, function (err, result) {
      if (err) {
        response.send(err)
        console.log(err)
      // On Error, close connection
      } else {
      // if there is no error, you have the result
        // response.json(result)
        console.log('result')
        console.log(result)
        strSlideDistributionLocation = result
      }
      conLocnIDLookup.end()
    })
  }

  console.log(strSlideDistributionLocation)

  // Set SQL based on action
  strSQL = '' +
  CaseBlockSlideSQL('First', 'funPreviousWorkDayCutoffDateTime()', 'funCurrentDayFirstRunCutoff()', strSlideDistributionLocation) +
  CaseBlockSlideSQL('Second', 'funCurrentDayFirstRunCutoff()', 'funCurrentDaySecondRunCutoff()', strSlideDistributionLocation) +
  CaseBlockSlideSQL('Third', 'funCurrentDaySecondRunCutoff()', 'funCurrentDayThirdRunCutoff()', strSlideDistributionLocation) +
  CaseBlockSlideSQL('Fourth', 'funCurrentDayThirdRunCutoff()', 'funCurrentDayFourthRunCutoff()', strSlideDistributionLocation) +
  CaseBlockSlideSQL('Total', 'funPreviousWorkDayCutoffDateTime()', 'now()', strSlideDistributionLocation)
  console.log(strSQL)

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

function CaseBlockSlideSQL (strRun, strStartTime, strCutoffTime, strSlideDistributionLocation) {
  // Parameter Examples:
  //  strRun: First
  //  strStartTime (function call to calculate time, or datetime): funPreviousWorkDayCutoffDateTime()
  //  strCutoffTime (function call to calculate time, or datetime): funCurrentDayFirstRunCutoff()
  //  strSlideDistributionLocation: 'LOCNDERM'

  let strSQL = `
    /*qry${strRun}RunCaseCount${strSlideDistributionLocation}*/
    SELECT Count(qrySubBlockCountWLocation.subAccessionID) AS ${strRun}RunCaseCount
    FROM (SELECT subTblSlides.AccessionID AS subAccessionID, subTblSlideDistribution.SlideDistributionLocation
            FROM tblSlides as subTblSlides
            INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
            WHERE subTblSlideDistribution.DTReadyForCourier >= ${strStartTime}
            AND  subTblSlideDistribution.DTReadyForCourier < ${strCutoffTime} AND
            SlideDistributionLocation = '${strSlideDistributionLocation}'
            GROUP BY subTblSlides.AccessionID, SlideDistributionLocation) as qrySubBlockCountWLocation
    GROUP BY SlideDistributionLocation;

    /*qry${strRun}RunBlockCount${strSlideDistributionLocation}*/
    SELECT Count(qrySubBlockCountWLocation.subBlockID) AS ${strRun}RunBlockCount
    FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
            FROM tblSlides as subTblSlides
            INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
            WHERE subTblSlideDistribution.DTReadyForCourier >= ${strStartTime}
            AND  subTblSlideDistribution.DTReadyForCourier < ${strCutoffTime} AND
            SlideDistributionLocation = '${strSlideDistributionLocation}'
            GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
    GROUP BY SlideDistributionLocation;

    /*qry${strRun}RunSlideCount${strSlideDistributionLocation}*/
    SELECT COUNT(subTblSlides.SlideID) AS ${strRun}RunSlideCount
    FROM tblSlides as subTblSlides
    INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
    WHERE subTblSlideDistribution.DTReadyForCourier >= ${strStartTime} AND
      subTblSlideDistribution.DTReadyForCourier < ${strCutoffTime} AND
      SlideDistributionLocation = '${strSlideDistributionLocation}';
    `
  return strSQL
}
