
var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')

var lastQueryTimes=[];
function CheckLastQueryCache(queryName,waitTime=15){
  if (lastQueryTimes[queryName]){
    var now = Date.now()
    var lastTime = lastQueryTimes[queryName].date
    if (Math.abs(lastTime - now) < 60*1000*waitTime){
      console.warn(queryName+" Cached Data")
      lastQueryTimes[queryName].data[0].timestamp = lastTime
      return lastQueryTimes[queryName].data
    }
    console.warn(queryName+" Expired Data")
  }
  console.warn(queryName+" DB Data")
}
function  db_query(query) {
  return new Promise((resolve, reject) => {
    var now = Date.now()
    var con = mysql.createConnection(mysqlConfig)
    con.query(query, function (err, result) {
      if (err) {reject(err);}
      resolve(result)
      con.end()
    })
  })
}

export async function printSlides (request, response) {

  var strDate = new Date().toLocaleString()
  var strBlockID = request.body.blockID
  var strPrintRequestBy = request.body.printRequestedBy
  var strSlideQueuePath = request.body.slideQueuePath
  if (strSlideQueuePath){if (strSlideQueuePath.slice(-1) !== '/') {strSlideQueuePath = strSlideQueuePath+'/'}}
  var strLocationID = request.body.printLocation || 'unknown'
  var strOrderPathInitials = ''
  var strSQL = `
           SELECT tblSlides.StainOrderDate,
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
            WHERE (((tblSlides.BlockID) = '${strBlockID}') AND tblSlides.ToBePrinted = TRUE);
  `
  var result = await db_query(strSQL).then((res)=> {return res}).catch((rej)=>{throw rej})
      var intRowCounter = 0
      Object.keys(result).forEach(function (key) {
        intRowCounter=intRowCounter+1
        var row = result[key]
        row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')

        row.OrderPathInitials == null || row.OrderPathInitials === 'null'
              ? strOrderPathInitials = ''
              : strOrderPathInitials = row.OrderPathInitials.substring(0, 3)

        var fileDate = new Date().toLocaleDateString().replaceall('-', '').replaceall('/', '')

        var currentFiles=[]
        fs.readdirSync(strSlideQueuePath).forEach(file => {
          currentFiles.append(file)
        });

        // WriteSlideData
        // SlideID|AccessionID|SlideInst|PartDesignator|BlockDesignator|StainOrderDate|OrderingPath|Patient|SiteLabel|SlideDistributionKeyword|StainLabel
        var strFileWriteData = [
              row.SlideID,
              row.AccessionID,
              row.SlideInst,
              row.PartDesignator,
              row.BlockDesignator,
              row.StainOrderDate,
              strOrderPathInitials,
              row.Patient,
              row.SiteLabel,
              row.SlideDistributionKeyword,
              row.StainLabel
            ].join('|');
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
        strSQL = `
              UPDATE tblSlides
              SET
                  Status = 'Printed',
                  Printed = TRUE,
                  DateTimePrinted =  strDate  ,
                  DTPrinted = NOW(),
                  LocationPrinted =  strLocationID ,
                  WhoPrinted =   strPrintRequestBy ,
                  TimesPrinted = TimesPrinted + 1,
                  Audit = CONCAT(Audit,'Slide Printed' + strDate + ' at ' + strLocationID + ' by ' + strPrintRequestBy + '.'),
                  ToBePrinted = FALSE
              WHERE
                  SlideID =   row.SlideID ;
        `
        db_query(strSQL).then((res)=> {return res}).catch((rej)=>{throw rej})
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
  var result = db_query(strSQL).then((res)=> {return res}).catch((rej)=>{throw rej})
  response.send({info:'Slides have been sent to Slide Printer',files:currentFiles})
}
export async function GetCaseInquery (request, response) {

  var strStrAccessionID = request.body.ACCESSIONID
  var strSQL = `
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
      WHERE  (( ( tblSlides.AccessionID ) LIKE "${strStrAccessionID}")) order by DTPrinted DESC;`
  await db_query(strSQL).then((res)=> {response.json(res)}).catch((rej)=>{throw rej})
}
export async function GetStatusData(request, response) {
  var result = CheckLastQueryCache('GetStatusData')
  if (result) {
    response.json(result)
  } else {
    var strSQL = `    
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
    await db_query(strSQL)
        .then(function(res) {
          lastQueryTimes['GetStatusData'] = {date: Date.now(), data: res}
          res[0].timestamp = Date.now()
          response.json(res)
        })
        .catch((rej)=>{
          throw rej
        })
  }
}
export async function getUserInfo (request, response) {

  var strUserID = request.body.userid
  var strSQL = `SELECT * FROM OPENLIS.tblUsers
              WHERE id = '${strUserID}';`
  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  response.json(result)
}
export async function GetBlockData (request, response) {

  var blockID = request.body.blockID
  var strSQL = `SELECT * FROM OPENLIS.tblBlock WHERE \`BlockID\` = '` + blockID + `';`
  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  else{response.json(result)}
}
export async function SetBlockData (request, response) {

  var blockData            = request.body.blockData.data[0]
  let ScanLocation         = request.body.scanlocation
  let userid               = request.body.userid
  let curRoute             = request.body.curRoute
  let TimesScannedAtEmbedding   = blockData.TimesScannedAtEmbedding
  let BlockID				       = blockData.BlockID
  if (!TimesScannedAtEmbedding){TimesScannedAtEmbedding=1}
  else{TimesScannedAtEmbedding = TimesScannedAtEmbedding+1}

  var strSQL = `
  UPDATE OPENLIS.tblBlock
      SET
      BlockStatus       = 'Embedded',
      embedded          = 1,
      embeddedDT        = NOW(),
      TimesScannedAtEmbedding = ${TimesScannedAtEmbedding}
    WHERE BlockID = '${BlockID}';
  `
  await db_query(strSQL)
  if ('error' in result) {throw result['error']}

  var strSQL = `
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
  await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  else{response.send('OK')}
}
export async function GetCassEngLoc (request, response) {

  var strSQL = `
select old_value,new_value,right_left_value
from engraver_lookup;
`

  await db_query(strSQL).then((res) => {
    response.json(res)
  }).catch((rej) => {
    throw rej
  })
}
export async function getPartBlockCurrentAndTotals (request, response) {

  var strBlockID = request.body.blockID
  var strAccessionId = null
  var strCurrentBlock = null
  var strCurrentPart = null
  var strNoPrefix = strBlockID.substring(4)
  var strTemp = strNoPrefix.split('_')
  strAccessionId = strTemp[0]
  strCurrentPart = strTemp[1]
  strCurrentBlock = strTemp[2]
  var strSQLTotalBlocks = `
SELECT BlockDesignator FROM OPENLIS.tblBlock where SpecNumFormatted = '${strAccessionId}' AND PartDesignator = '${strCurrentPart}' order by ABS(BlockDesignator) desc limit 1;`
  var strSQLTotalParts = `
SELECT PartDesignator FROM OPENLIS.tblBlock where SpecNumFormatted = '${strAccessionId}' order by PartDesignator desc LIMIT 1;`
  var strSQL = strSQLTotalBlocks + strSQLTotalParts
  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
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
export async function updateSlideToPrint (request, response) {

  var strResponse = ''
  var strAction = request.body.action
  var strSlideID = request.body.slideId
  var blToPrintStatus = request.body.toPrintStatus

  var strSQL = `UPDATE \`OPENLIS\`.\`tblSlides\`
            SET
              \`ToBePrinted\` = ` + blToPrintStatus +
            ` WHERE \`SlideID\` = '` + strSlideID + `';`

  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  response.send('OK')
}
export async function pullSlides (request, response) {

  var urlParts = url.parse(request.url, true)
  var parameters = urlParts.query
  var strBlockID = parameters.blockid
  var strSQL = `
SELECT tblSlides.AccessionID,
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
  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  Object.keys(result).forEach(function (key) {
    var row = result[key]
    row.StainOrderDate = dateFormat(row.StainOrderDate, 'shortDate')
    if (row.OrderingPath === 'null') {
      row.OrderingPath = ''
    }
  })
  response.json(result)
}
export async function histoData (request, response) {
  var strFromDateTime = request.body.fromdatetime
  var strToDateTime = request.body.todatetime
  var strSQL = `
SELECT qrySubBlocksPreviousDay.WhoPrinted, Count(qrySubBlocksPreviousDay.BlockID) AS CountOfBlockID
  FROM (SELECT tblSlides.WhoPrinted, tblSlides.BlockID
        FROM tblSlides
        WHERE (((tblSlides.DTPrinted)>=('${strFromDateTime}') And (tblSlides.DTPrinted)<'${strToDateTime}'))
        GROUP BY tblSlides.WhoPrinted, tblSlides.BlockID) as qrySubBlocksPreviousDay
  GROUP BY qrySubBlocksPreviousDay.WhoPrinted;`
  var result = await db_query(strSQL)
  if ('error' in result) {throw result['error']}
  response.json(result)
}
export async function slideDistribution (request, response) {
  let strAction = request.body.action
  let strUser = request.body.userid
  let strScanLocation = request.body.scanlocation
  switch (strAction) {
    case 'CreateNewSlideDistribution':
      let strSlideTrayID = request.body.slidetray
      let strSQL = `
INSERT INTO OPENLIS.tblSlideDistribution
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
      var result = await db_query(strSQL)
      if ('error' in result) {throw result['error']}
      response.json(result)
      break
    case 'MarkSlideToBeDistributed':
      let strSlideDistID = request.body.slidedistid
      let strSlideTray = request.body.slidetray
      let strSlideID = request.body.slideid
      let strSQLMarkToBeDistributed = `
UPDATE OPENLIS.tblSlides
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
      var result = await db_query(strSQLMarkToBeDistributed)
      if ('error' in result) {throw result['error']}
      response.json(result)
      break
    case 'MarkSlidesReadyForCourier':
      let strSlideDistIDMarkForCourier = request.body.slidedistid
      let strUserMarkForCourier = request.body.userid
      let strSlideDistrLocID = request.body.slidedistrloc
      let strScanLocationMarkForCourier = request.body.scanlocation
      let strSQLMarkSlidesReadyForCourier = `
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
      var result = await db_query(strSQLMarkSlidesReadyForCourier)
      if ('error' in result) {throw result['error']}
      response.json(result)
      break
    case 'AssignTrayNewLocation':
      let strUserTrayNewLoc = request.body.userid
      let strSlideDistrLocIDForST = request.body.slidedistrloc
      let strScanLocationForST = request.body.scanlocation
      let strSlideTrayIDForST = request.body.slidetray
      let strSQLAssignNewLoc = `
UPDATE OPENLIS.tblSlideDistribution as tblUpdate
      Inner Join (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDForST}') as tblB ON tblUpdate.SlideDistributionID = tblB.SlideDistID
      SET
      tblUpdate.SlideDistributionLocation = '${strSlideDistrLocIDForST}',
      tblUpdate.Audit = CONCAT(tblUpdate.Audit, 'Assigned location:',NOW(), '.'),
      tblUpdate.StationLocationScanned = '${strScanLocationForST}',
      tblUpdate.WhoSetLocation = '${strUserTrayNewLoc}'
      WHERE tblUpdate.SlideDistributionID = SlideDistID;`
      var result = await db_query(strSQLAssignNewLoc)
      if ('error' in result) {throw result['error']}
      response.json(result)
      break
    case 'LoadSlideTray':
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
      var result = await db_query(strSQLExistingST)
      if ('error' in result) {throw result['error']}
      response.json(result)
      break
  }
}