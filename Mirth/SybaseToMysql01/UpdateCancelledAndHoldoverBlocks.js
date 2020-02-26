//  Sync Slide Orders that do not match due to block being deleted.
//  Not matched because block_inst gets updated when new block is created.

var dbConnMYSQL
var dbConnCoPath
var strSQL
var strSQL1
// var strSQL2 - set within try later
var CancelledBlockResult
var intResultSize
var intSuccessfullInserts = 0
var strLastSyncDateTime = $('strLastSyncDateTime') // Last DateTime Sync was ran
var strDBInsertStatus
const strMYSQLUserName = configurationMap.get('MYSQLUserName')
const strMYSQLPassword = configurationMap.get('MYSQLPassword')
const strMYSQLJDBCConnection = configurationMap.get('MYSQLJDBCConnection')
const strMYSQLJDBCDriver = configurationMap.get('MYSQLJDBCDriver')
const strSybaseUserName = configurationMap.get('SybaseUserName')
const strSybasePassword = configurationMap.get('SybasePassword')
const strSybaseJDBCConnection = configurationMap.get('SybaseJDBCConnection')
const strSybaseJDBCDriver = configurationMap.get('SybaseJDBCDriver')
var strSyncID = $('intLastSyncID')
var intDebugLevel = 0

// If no syncid, set as 0.
if (isNaN(strSyncID)) {
  strSyncID = 0
} else if (strSyncID == '') {
  strSyncID = 0
}

// Get cancelled blocks
strSQL1 = "SELECT specimen_id, part_inst, block_inst FROM OPENLIS.copath_p_stainprocess where _lastSyncTime > '" + strLastSyncDateTime + "' Blkstatus_id = '$can' ;"

if (intDebugLevel > 1) {
  logger.debug('strSQL1:' + strSQL1)
}

try {
  dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection(strSybaseJDBCDriver, strSybaseJDBCConnection, strSybaseUserName, strSybasePassword)

  CancelledBlockResult = dbConnCoPath.executeCachedQuery(strSQL1)

  // Loop set result size for loop.  Loop after dbconn established.
  intResultSize = CancelledBlockResult.size()

  try {
    // Connect to SlideTracker
    dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword)

    if (intResultSize > 0) {
      for (var i = 0; i < intResultSize; i++) {
        // For each stin that is not matched get Block Desig Label
        CancelledBlockResult.next()
        // try Catch within loop.  CancelledBlockResult.getString Errors when block inst is null.
        try {
          // Update each block marked cancelled
          // Get Specimen_id, PartInst, BlockInst

          var strSpecimenID = (CancelledBlockResult.getString('Specimen_id'))
          var strPartInst = (CancelledBlockResult.getString('PartInst'))
          var strBlockInst = (CancelledBlockResult.getString('BlockInst'))

          var strSQL2 = ''

          strSQL2 = '/*qryUpdateCancelledBlocks*/ \
            UPDATE OPENLIS.tblBlock \
            SET \
            Cancelled = 1 \
            WHERE Specimen_id = \'' + strSpecimenID  + '\' AND \
            PartInst = ' + strPartInst + ' AND \
            BlockInst = ' + strBlockInst + ';' 

          if (intDebugLevel > 1) {
            logger.debug("strSQL2:" + strSQL2)
          }

          var updateCanceledResult = dbConnMYSQL.executeUpdate(strSQL2)

          if (intDebugLevel > 9) {
            logger.debug("updateCanceledResult Completed")
          }

          // Only update if there is a result
          if (updateCanceledResult.size() > 0) {
            // Load first restult otherwise error thrown
            updateCanceledResult.next()
          }
        } catch (err) {
          // GetStringError
          logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL2:" + strSQL2)
          logger.debug("Catch 116")
        } finally {
        }
      } // End For loop
    } // End if slide orders exist.
  } // End try
  catch (err) {
    logger.debug("ERROR- db error - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL1: " + strSQL1 + " SQL2: " + strSQL2);
  } finally {
    if (dbConnMYSQL) {
      dbConnMYSQL.close()
    }
  }

  // logger.info( CancelledBlockResult.toString() );
  // channelMap.put ("strSpecimenID", strSpecimenID);
} finally {
  if (dbConnCoPath) {
    dbConnCoPath.close()
  }
}
function SanitizeVariableAddLeadingAndTrailingApostrophies (txt) {
    if (txt == null) {
        return "null"
    } else {
        return "'" + EscapeApostrophe(txt) + "'"
    }
  }
  function EscapeApostrophe(txt)  {
    return (txt + "").replace(/\'/g, "''")
  }
  function SanitizeVariableAddLeadingAndTrailingApostrophiesNullAsEmptyString (txt) {
    if (txt == null) {
        return ""
    } else {
        return "'" + EscapeApostrophe(txt) + "'"
    }
  }
  function SanitizeVariableNoLeadingAndTrailingApostrophiesNullAsEmptyString (txt) {
    if (txt == null) {
        return ""
    } else {
        return EscapeApostrophe(txt)
    }
  }
  