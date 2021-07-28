var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')

module.exports = {
  printSlides: printSlides,
  getUserInfo: getUserInfo,
  updateSlideToPrint: updateSlideToPrint,
  pullSlides: pullSlides,
  getPartBlockCurrentAndTotals: getPartBlockCurrentAndTotals,
  histodata: histoData,
  slideDistribution: slideDistribution,
  GetBlockData: GetBlockData,
  SetBlockData: SetBlockData,
  GetStatusData: GetStatusData,
  GetCassEngLoc: GetCassEngLoc,
  caseinquiry: GetCaseInquery
}

function printSlides (request, response, callback) {
  //= ==========================================================================================
  //    app.post printslides
  //      Prints Slides and updates tracking info
  //
  //    When to call:
  //      AFter you know the blockid and you are ready to print a slide
  //= ===========================================================================================
  console.log('/printSlides')

  var strLocationID = 'unknown'
  var strSQLUpdateStatement = ''

  var strDate
  strDate = new Date().toLocaleString()
  var strBlockID = request.body.blockID
  var strPrintRequestBy = request.body.printRequestedBy
  var strSlideQueuePath = request.body.slideQueuePath
  if (strSlideQueuePath.slice(-1) != '/') {strSlideQueuePath = strSlideQueuePath+'/'}
  strLocationID = request.body.printLocation
  var strOrderPathInitials = ''

  var strSQL = ` SELECT tblSlides.StainOrderDate,
         tblSlides.SlideID,
         tblSlides.AccessionID,
         tblSlides.SlideInst,
         tblSlides.PartDesignator,
         tblSlides.BlockDesignator,
         tblSlides.Patient,
         tblSlides.SiteLabel,
         tblSlides.StainLabel,
         tblCassetteColorHopperLookup.Color AS SlideDistributionKeyword,
         copath_c_d_person_1.initials       AS OrderPathInitials
  FROM tblSlides
           LEFT JOIN (copath_p_stainprocess,tblBlock,tblCassetteColorHopperLookup,copath_c_d_stainstatus,copath_c_d_person,copath_c_d_person AS copath_c_d_person_1,copath_c_d_department)
                     ON (tblSlides.BlockStainInstID = copath_p_stainprocess._blockstaininstid
                         and tblSlides.BlockID = tblBlock.BlockID
                         and tblBlock.Hopper = tblCassetteColorHopperLookup.HopperID
                         and copath_p_stainprocess.stainstatus_id = copath_c_d_stainstatus.id
                         and copath_p_stainprocess.status_who_id = copath_c_d_person.id
                         and copath_p_stainprocess.orderedby_id = copath_c_d_person_1.id
                         and copath_p_stainprocess.wkdept_id = copath_c_d_department.id)
  WHERE (((tblSlides.BlockID) = '${strBlockID}') AND tblSlides.ToBePrinted = TRUE);`

  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      let intRowCounter = 0

      Object.keys(result).forEach(function (key) {
        intRowCounter++
        var row = result[key]
        row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')

        if (row.OrderPathInitials == null) {
          strOrderPathInitials = ''

        } else if (row.OrderPathInitials === 'null') {
          strOrderPathInitials = ''

        } else {
          strOrderPathInitials = row.OrderPathInitials

        }
        strOrderPathInitials = strOrderPathInitials.substring(0, 3)

        var d = new Date().toLocaleDateString()
        var fileDate = d.replace(/-|\//g, '')

        // WriteSlideData
        // SlideID|AccessionID|SlideInst|PartDesignator|BlockDesignator|StainOrderDate|OrderingPath|Patient|SiteLabel|SlideDistributionKeyword|StainLabel
        var strFileWriteData = row.SlideID + '|' + row.AccessionID + '|' + row.SlideInst + '|' + row.PartDesignator + '|' + row.BlockDesignator + '|' + row.StainOrderDate + '|' + strOrderPathInitials + '|' + row.Patient + '|' + row.SiteLabel + '|' + row.SlideDistributionKeyword + '|' + row.StainLabel

        var strSlideFlatFileFullName = strSlideQueuePath + row.SlideID + '_' + fileDate + '.txt'

        fs.writeFileSync(strSlideFlatFileFullName, strFileWriteData,
          function (err) {
            if (err) throw err
            console.error(err)
            response.send(err)
          })

        try {
          if (fs.existsSync(strSlideFlatFileFullName)) {
            console.log("FILE DOES EXIST: "+strSlideFlatFileFullName)
          }
        } catch(err) {
          console.error("FILE DOESNT EXIST: "+err)
          response.send(err)
        }

        strSQLUpdateStatement = `UPDATE \`OPENLIS\`.\`tblSlides\`
                                                    SET
                                                        \`Status\` = 'Printed',
                                                        \`Printed\` = TRUE,
                                                        \`DateTimePrinted\` = '` + strDate + `',
                                                        \`DTPrinted\` = NOW(),
                                                        \`LocationPrinted\` = '` + strLocationID + `',
                                                        \`WhoPrinted\` = '` + strPrintRequestBy + `',
                                                        \`TimesPrinted\` = \`TimesPrinted\` + 1,
                                                        \`Audit\` = CONCAT(\`Audit\`,
                                                                ' Slide Printed ` + strDate + ' at ' + strLocationID + ' by ' + strPrintRequestBy + `.'),
                                                        \`ToBePrinted\` = FALSE
                                                    WHERE
                                                        \`SlideID\` = '` + row.SlideID + `';`

        con.query(strSQLUpdateStatement, function (err, updateresult) {
          if (err) {
            console.error(err)
            response.send(err)
          }
        })
      })

      let strTempSQL = `
        /*qryUpdateBlockSlidesPrinted*/
        UPDATE OPENLIS.tblBlock
        SET
        BlockStatus = 'Cut',
        TimesSlidesPrintedAtMicrotomy = COALESCE(TimesSlidesPrintedAtMicrotomy, 0) + ${intRowCounter},
        FirstSlidePrintedDT = IF( AnySlidesPrinted = 1, FirstSlidePrintedDT, NOW()),
        LastSlidePrintedDT = IF( AnySlidesPrinted = 1, NOW(), LastSlidePrintedDT),
        AnySlidesPrinted = 1,
        Audit = CONCAT(COALESCE(Audit), ' ', NOW(), ' ${intRowCounter} slide(s) printed off block by ${strPrintRequestBy} at ${strLocationID}.')
        WHERE BlockID = '${strBlockID}';
        /*qryUpdatetblActionTrackingSlidesPrinted*/
          INSERT INTO OPENLIS.tblActionTracking (
            Action,
            IDOfMaterial,
            User,
            Station,
            ActionDateTime,
            Count
          )
          VALUES (
            'SlidesPrintedOffBlock',
            '${strBlockID}',
            '${strPrintRequestBy}',
            '${strLocationID}',
            NOW(),
            ${intRowCounter}
          );
        `

      con.query(strTempSQL, function (err, updateresult) {
        if (err) {
          console.error(err)
          response.send(err)
        }
      })
    }
    con.end()
  })

  response.send('Slides have been sent to Slide Printer')
}

function GetCaseInquery (request, response, callback) {
  //= ==========================================================================================
  //    Function GetCaseInquery
  //      Get Case Inquery Data
  //
  //    When to call:
  //      To get data for use with case inqueries
  //= ===========================================================================================

  var strStrAccessionID = request.body.ACCESSIONID

  var strSQL =
`
/*qryCaseInquiry*/
      SELECT tblSlides.SlideID, 
              tblSlides.StainLabel, 
              tblSlideDistribution.Status, 
              '' AS 'blnk1',
              tblSlides.StainOrderDate as 'Order Time',
              tblBlock.DateTimeEngraved,
              '' AS 'blnk2',
              tblActionTracking.Station as 'Embedded Location',
              tblActionTracking.ActionDateTime as 'Embedded Time',
              '' AS 'blnk3',
              tblSlides.LocationPrinted as 'Slide Printed Location', 
              tblSlides.DTPrinted as 'Slide Printed Time', 
              '' AS 'blnk4',
              tblSlideDistribution.SlideDistributionLocation, 
              tblSlideDistribution.DTReadyForCourier, 
              tblSlideDistribution.SlideTray

      FROM   (tblSlides 
              LEFT JOIN tblSlideDistribution 
                      ON tblSlides.SlideDistributionID = 
                        tblSlideDistribution.SlideDistributionID) 
              LEFT JOIN tblBlock 
                    ON tblSlides.BlockID = tblBlock.BlockID 
              LEFT JOIN tblActionTracking 
                    ON tblSlides.BlockID = tblActionTracking.IDOfMaterial
                    and tblActionTracking.Action='Embedded'
      WHERE  (( ( tblSlides.AccessionID ) LIKE "` + strStrAccessionID + `"))
      order by DTPrinted DESC;
`

  console.log('/GetCaseInquery')
  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  }) // End query
}

function GetStatusData (request, response, callback) {
  //= ==========================================================================================
  //    Function GetStatusData
  //      Get Status Data
  //
  //    When to call:
  //      To get Status of block/slides
  //= ===========================================================================================
  var strSQL =
`
select count(*) as 'count','pre Embedded'
from tblBlock
where 1 not in (select IDOfMaterial from tblActionTracking)
and BlockStatus is null
and PartDescription not like 'B%' -- bone marrow
and DateTimeEngraved > now() - interval 1 day
and TimesEngraved>0
union all
select count(action),action 
from tblActionTracking
where ActionDateTime > now() - interval 1 day
and action='Embedded'
group by action
union all
select count(action),action 
from tblActionTracking
where ActionDateTime > now() - interval 1 day
and action='SlidesPrintedOffBlock'
group by action
union all
SELECT count(distinct BlockID),'distributed'
FROM tblSlides
INNER JOIN   tblSlideDistribution on tblSlides.SlideDistributionID = tblSlideDistribution.SlideDistributionID
WHERE tblSlideDistribution.DTReadyForCourier >date_format(curdate() - if(weekday(curdate()) >= 5, if(weekday(curdate()) = 6, 2, 1), 1),'%Y-%m-%d 18:00:00');
`
  console.log('/GetStatusData')

  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  }) // End query
}

function getUserInfo (request, response, callback) {
  //= ==========================================================================================
  //    Function getUserInfo
  //      Get User Info
  //
  //    When to call:
  //      To get userinfo based on badge barcode
  //= ===========================================================================================
  var strUserID = request.body.userid

  var strSQL = `SELECT * FROM OPENLIS.tblUsers
              WHERE \`id\` = '` + strUserID + `';`

  console.log('/getUserInfo')

  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  }) // End query
}

function GetBlockData (request, response, callback) {
  //= ==========================================================================================
  //    Function blockdata
  //      Get Block Info
  //
  //    When to call:
  //      To get block info
  //= ===========================================================================================
  var blockID = request.body.blockID
  var strSQL = `SELECT * FROM OPENLIS.tblBlock WHERE \`BlockID\` = '` + blockID + `';`
  console.log('/GetBlockData')

  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  })
}

function SetBlockData (request, response, callback) {
  //= ==========================================================================================
  //    Function blockdata
  //      Set Block Info
  //
  //    When to call:
  //      To set block info
  //= ===========================================================================================


  var blockData            = request.body.blockData.data[0]
  let ScanLocation         = request.body.scanlocation
  let userid               = request.body.userid
  let curRoute             = request.body.curRoute
  let TimesScannedAtEmbedding   = blockData.TimesScannedAtEmbedding
  let BlockID				       = blockData.BlockID
  if (!TimesScannedAtEmbedding){TimesScannedAtEmbedding=1}
  else{TimesScannedAtEmbedding = TimesScannedAtEmbedding+1}

  console.log('/SetBlockData: '+BlockID)

  var strSQL =
  `
  UPDATE OPENLIS.tblBlock
      SET
      BlockStatus       = 'Embedded',
      embedded          = 1,
      embeddedDT        = NOW(),
      TimesScannedAtEmbedding = ${TimesScannedAtEmbedding}
    WHERE BlockID = '${BlockID}';
  `

  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    }
  })

  var strSQL =
    `
    INSERT INTO OPENLIS.tblActionTracking
      (Action,
      IDOfMaterial,
      User,
      Station,
      ActionDateTime)
   VALUES
      ('Embedded',
      '${BlockID}',
      '${userid}',
      '${ScanLocation}',
      NOW());
    `
  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    }
    con.end()
  })
  response.send('OK')
}

function GetCassEngLoc (request, response, callback) {
  //= ==========================================================================================
  //    Function GetCassEngLoc
  //      Get Cassette Engraver Locations
  //
  //    When to call:
  //      To get cassette engraver locations
  //= ===========================================================================================

  var strSQL =
`
select old_value,new_value,right_left_value
from engraver_lookup;
`
  console.log('/GetCassEngLoc')

  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  })
}

function getPartBlockCurrentAndTotals (request, response, callback) {
  //= ==========================================================================================
  //    Function getPartBlockCurrentAndTotals
  //      Get Current and How Many Parts are on case and Blocks are on this part
  //
  //    When to call:
  //      When block is scanned
  //= ===========================================================================================
  var strBlockID = request.body.blockID
  var strAccessionId = null
  var strCurrentBlock = null
  var strCurrentPart = null

  var strNoPrefix = strBlockID.substring(4)
  var strTemp = strNoPrefix.split('_')
  strAccessionId = strTemp[0]
  strCurrentPart = strTemp[1]
  strCurrentBlock = strTemp[2]

  var con = mysql.createConnection(mysqlConfig)
  console.log('/getPartBlockCurrentAndTotals')

  var strSQLTotalBlocks = `SELECT BlockDesignator FROM OPENLIS.tblBlock where SpecNumFormatted = '${strAccessionId}' AND PartDesignator = '${strCurrentPart}' order by ABS(BlockDesignator) desc limit 1;`
  var strSQLTotalParts = `SELECT PartDesignator FROM OPENLIS.tblBlock where SpecNumFormatted = '${strAccessionId}' order by PartDesignator desc LIMIT 1;`
  var strSQL = strSQLTotalBlocks + strSQLTotalParts

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      var strTotalBlocks = result[0][0].BlockDesignator
      var strTotalParts = result[1][0].PartDesignator
      var jsonResult = {
        currentblock: strCurrentBlock,
        currentpart: strCurrentPart,
        totalblocks: strTotalBlocks,
        totalparts: strTotalParts
      }
      response.json(jsonResult)
    }
    con.end()
  })
}

function updateSlideToPrint (request, response, callback) {
  //= ==========================================================================================
  //    Function updateslidetoprint
  //      Update Slide To Print
  //
  //    Purpose:
  //      Updated the database that a slide needs to be printed, or does not need to be printed.
  //= ===========================================================================================
  var strResponse = ''
  var strAction = request.body.action
  var strSlideID = request.body.slideId
  var blToPrintStatus = request.body.toPrintStatus

  var strSQL = `UPDATE \`OPENLIS\`.\`tblSlides\`
            SET
              \`ToBePrinted\` = ` + blToPrintStatus +
            ` WHERE \`SlideID\` = '` + strSlideID + `';`
  console.log('/updateSlideToPrint')

  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      strResponse = result.affectedRows + ' record(s) updated'
    }
    con.end()
  })
  response.send('OK')
}

function pullSlides (request, response, callback) {
  //= ==========================================================================================
  //    Used to lookup slides by BlockID
  //
  //    Purpose:
  //      Pulls all pending slides for block
  //= ===========================================================================================
  var urlParts = url.parse(request.url, true)
  var parameters = urlParts.query
  var strBlockID = parameters.blockid

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

  console.log('/pullSlides')
  var con = mysql.createConnection(mysqlConfig)

  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      Object.keys(result).forEach(function (key) {
        var row = result[key]
        row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
        if (row.OrderingPath === 'null') {
          row.OrderingPath = ''
        }
      })
      response.json(result)
    }
    con.end()
  })
}

function histoData (request, response, callback) {
  // ===========================================================================================
  //    Histo data for chart
  // ============================================================================================

  console.log('histodata start')
  var strFromDateTime = request.body.fromdatetime
  var strToDateTime = request.body.todatetime

  var strSQL = `SELECT qrySubBlocksPreviousDay.WhoPrinted, Count(qrySubBlocksPreviousDay.BlockID) AS CountOfBlockID
    FROM (SELECT tblSlides.WhoPrinted, tblSlides.BlockID
          FROM tblSlides
          WHERE (((tblSlides.DTPrinted)>=('${strFromDateTime}') And (tblSlides.DTPrinted)<'${strToDateTime}'))
          GROUP BY tblSlides.WhoPrinted, tblSlides.BlockID) as qrySubBlocksPreviousDay
    GROUP BY qrySubBlocksPreviousDay.WhoPrinted;`
  console.log('/histoData')
  // Connect to the database
  var con = mysql.createConnection(mysqlConfig)
  con.query(strSQL, function (err, result) {
    if (err) {
      console.error(err)
      response.send(err)
    } else {
      response.json(result)
    }
    con.end()
  })
}

function slideDistribution (request, response, callback) {
  // ===========================================================================================
  //    Slide Distribution
  // ============================================================================================

  console.log('slide distribution start')
  let strAction = request.body.action
  let strUser = request.body.userid
  let strScanLocation = request.body.scanlocation

  switch (strAction) {
    case 'CreateNewSlideDistribution':
      console.log('Create new slide distr')
      let strSlideTrayID = request.body.slidetray

      let strSQL = `INSERT INTO OPENLIS.tblSlideDistribution
                    (SlideTray,
                    Status,
                    WhoMarkedReadyForCourier,
                    DTReadyForCourier,
                    SlideDistributionLocation,
                    StationSlideTrayScanned,
                    Audit)
                    VALUES
                    ('${strSlideTrayID}',
                    'PendingLocation',
                    '${strUser}',
                    NOW(),
                    'Location Being Assigned',
                    '${strScanLocation}',
                    concat('Initial insert:', now(), ' ')
                    );`

      console.log('/CreateNewSlideDistribution')
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
      break
    case 'MarkSlideToBeDistributed':
      console.log('Mark Slide To Be Distributed')
      let strSlideDistID = request.body.slidedistid
      let strSlideTray = request.body.slidetray
      console.log('Slide Distr ID:')
      let strSlideID = request.body.slideid

      let strSQLMarkToBeDistributed = `UPDATE OPENLIS.tblSlides
      SET
      Status = 'ReadyForCourier',
      Audit = CONCAT(Audit, 'Marked in tray:',NOW(), '.'),
      SlideStatusID = '$itpl',
      SlideDistributionID = ${strSlideDistID}
      WHERE SlideID = '${strSlideID}';
      /*qrySlideCountInTrayBySlideDistr*/
      SELECT 	distinct ts3.SlideID,
  			ts1.CaseSlidesInTray,
        ts2.CaseSlidesTotal,
        ts2.CaseSlidesTotal-ts1.CaseSlidesInTray
  	from
  			(SELECT AccessionID,COUNT(SlideID) AS CaseSlidesInTray FROM tblSlides where SlideDistributionID = ${strSlideDistID} GROUP BY AccessionID, SlideCount) ts1
      inner join
  			(SELECT AccessionID,COUNT(tblSlides.SlideID) AS CaseSlidesTotal FROM tblSlides where AccessionID IN (select distinct AccessionID from tblSlides where SlideDistributionID = ${strSlideDistID}) GROUP BY AccessionID) ts2
              on ts1.AccessionID = ts2.AccessionID
  	inner join
  			(SELECT SlideID,AccessionID FROM tblSlides where tblSlides.SlideDistributionID = ${strSlideDistID} GROUP BY SlideID,AccessionID) ts3
              on ts1.AccessionID = ts3.AccessionID
  	order by ts3.SlideID;
  	      SELECT Count(SlideID) AS 'SlidesInTray'
      FROM tblSlides
      WHERE SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTray}');
      SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
      FROM (SELECT subTblSlides.BlockID AS subBlockID
            FROM tblSlides as subTblSlides
            WHERE subTblSlides.SlideDistributionID = ${strSlideDistID}
            GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
      ;`

      var con2 = mysql.createConnection(mysqlConfig)
      con2.query(strSQLMarkToBeDistributed, function (err, result) {
        if (err) {
          response.send(err)
          console.error(err)
        } else {
          response.json(result)
        }
        con2.end()
      })
      break
    case 'MarkSlidesReadyForCourier':
      console.log('Mark Slide Ready For Courier')
      let strSlideDistIDMarkForCourier = request.body.slidedistid
      let strUserMarkForCourier = request.body.userid
      let strSlideDistrLocID = request.body.slidedistrloc
      let strScanLocationMarkForCourier = request.body.scanlocation
      let strSQLMarkSlidesReadyForCourier =
      `
        UPDATE OPENLIS.tblSlideDistribution
        SET
        Status = 'Ready For Courier',
        DTReadyForCourier = NOW(),
        SlideDistributionLocation = '${strSlideDistrLocID}',
        Audit = CONCAT(Audit, 'Assigned location, marked ready for courier:',NOW(), '.'),
        StationLocationScanned = '${strScanLocationMarkForCourier}',
        WhoSetLocation = '${strUserMarkForCourier}'
        WHERE SlideDistributionID = ${strSlideDistIDMarkForCourier};
        UPDATE OPENLIS.tblSlides
        SET
        SlideStatusID = '$rfc'
        WHERE SlideDistributionID = ${strSlideDistIDMarkForCourier};
      `

      var con3 = mysql.createConnection(mysqlConfig)
      con3.query(strSQLMarkSlidesReadyForCourier, function (err, result) {
        if (err) {
          response.send(err)
          console.error(err)
        } else {
          response.json(result)
        }
        con3.end()
      })
      break
    case 'AssignTrayNewLocation':
      console.log('AssignTrayNewLocation')

      let strUserTrayNewLoc = request.body.userid
      let strSlideDistrLocIDForST = request.body.slidedistrloc
      let strScanLocationForST = request.body.scanlocation
      let strSlideTrayIDForST = request.body.slidetray

      let strSQLAssignNewLoc = `UPDATE OPENLIS.tblSlideDistribution as tblUpdate
      Inner Join (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDForST}') as tblB ON tblUpdate.SlideDistributionID = tblB.SlideDistID
      SET
      tblUpdate.SlideDistributionLocation = '${strSlideDistrLocIDForST}',
      tblUpdate.Audit = CONCAT(tblUpdate.Audit, 'Assigned location:',NOW(), '.'),
      tblUpdate.StationLocationScanned = '${strScanLocationForST}',
      tblUpdate.WhoSetLocation = '${strUserTrayNewLoc}'
      WHERE tblUpdate.SlideDistributionID = SlideDistID;`

      var con4 = mysql.createConnection(mysqlConfig)
      con4.query(strSQLAssignNewLoc, function (err, result) {
        if (err) {
          response.send(err)
          console.error(err)
        } else {
          response.json(result)
        }
        con4.end()
      })
      break
    case 'LoadSlideTray':
      console.log('Load Existing Slide Tray')
      let strSlideTrayIDExistingST = request.body.slidetray

      let strSQLExistingST = `
      /*Query01*/
      SELECT max(subTblSlideDistribution.SlideDistributionID) as CurrentSlideDistID
      FROM tblSlideDistribution as subTblSlideDistribution
      WHERE SlideTray = '${strSlideTrayIDExistingST}';
      /*qrySlideCountInTrayBySlideTray*/
      SELECT
          tblSlides.SlideID,
          qrySubSlideCountsByAcc.CaseSlidesInTray,
          qrySubSlideCountsByAcc.CaseSlidesTotal,
          qrySubSlideCountsByAcc.CaseSlidesNotInTray
      FROM
          tblSlides
              INNER JOIN
          (SELECT
              qrySlideCountInTrayByCase.AccessionID,
                  qrySlideCountInTrayByCase.CaseSlidesInTray,
                  vwSlideCountByCase.CaseSlidesTotal,
                  (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) AS CaseSlidesNotInTray
          FROM
              (SELECT
              tblSlides.AccessionID,
                  COUNT(tblSlides.SlideID) AS CaseSlidesInTray
          FROM
              tblSlides
          WHERE
              (((tblSlides.SlideDistributionID) = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDExistingST}')))
          GROUP BY tblSlides.AccessionID , tblSlides.SlideCount) AS qrySlideCountInTrayByCase
          INNER JOIN vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID) AS qrySubSlideCountsByAcc ON qrySubSlideCountsByAcc.AccessionID = tblSlides.AccessionID
      WHERE
          tblSlides.SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDExistingST}');
      SELECT Count(SlideID) AS 'SlidesInTray'
      FROM tblSlides
      WHERE SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDExistingST}');
      SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
      FROM (SELECT subTblSlides.BlockID AS subBlockID
            FROM tblSlides as subTblSlides
            WHERE subTblSlides.SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDExistingST}')
            GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
      ;`

      var con5 = mysql.createConnection(mysqlConfig)
      con5.query(strSQLExistingST, function (err, result) {
        if (err) {
          response.send(err)
          console.error(err)
        } else {
          response.json(result)
        }
        con5.end()
      })
      break
    default:
      break
  }
}