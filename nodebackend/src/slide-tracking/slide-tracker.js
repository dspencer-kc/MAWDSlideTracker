var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')



module.exports = {
  printSlides: printSlides,
  getUserInfo: getUserInfo,
  updateSlideToPrint: updateSlideToPrint,
  pullSlides: pullSlides
}

function printSlides (request, response, callback) {
  //= ==========================================================================================
  //
  //    app.post printslides
  //      Prints Slides and updates tracking info
  //
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
  // print the slides here
  console.log(request)
    var strLocationID = 'unknown'
    var strSQLUpdateStatement = ''

    var strDate
    strDate = new Date().toLocaleString()

    var strAction = request.body.action
    var strBlockID = request.body.blockID
    var strPrintRequestBy = request.body.printRequestedBy
    var strSlideQueuePath = request.body.slideQueuePath

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

    // Connect to the database
  var con = mysql.createConnection(mysqlConfig)

    console.log('Connected!')
    con.query(strSQL, function (err, result) {
      if (err) {
        console.log(err)
    } else {

      console.log(result)
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
          if (updateerr) {
            console.log('updateerror:',updateerr)
          }
          else{
                    console.log(strSQLUpdateStatement)
                    console.log(updateresult.affectedRows + ' record(s) updated')
          }
          //Do not end connection, as you need to go through the entire loop
        }) //end update query
      })


    }
      con.end()

    }) //end qury

    console.log(`${strBlockID}`)
    response.send('Slides have been sent to Slide Printer')

}

//function getSlideParameters (request, response, callback) {
//  // get some slide parameters here
//}

function getUserInfo (request, response, callback) {
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
  //= ==========================================================================================
  //
  //    Function updateslidetoprint
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

  // Connect to the database
  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      response.send(err)
      console.log(err)
      // On Error, close connection
    } else {
      // if there is no error, you have the result
      strResponse = result.affectedRows + ' record(s) updated'
      console.log(strResponse)
    }
    con.end()
  })
  // });

  console.log(strSlideID)
  console.log(blToPrintStatus)
  console.log(strAction)
  response.send('OK')
}

function pullSlides (request, response, callback) {
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
  var strBlockID = parameters.blockid


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
  //console.log(strSQL)

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
        if (row.OrderingPath = 'null') {
          row.OrderingPath = ''
        }
      })

      //console.log(result)
      response.json(result)
    }
    con.end()
  })
  // });
  // con.end();
  console.log(`${strBlockID}`)
}
