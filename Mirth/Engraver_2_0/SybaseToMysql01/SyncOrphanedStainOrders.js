
//Sync Slide Orders that do not match due to block being deleted.
//  Not matched because block_inst gets updated when new block is created.


var dbConnMYSQL;
var dbConnCoPath;
var strSpecimenID = "empty";
var strSQL;
var strSQL1;
var strSQL2;
var orphanStainResult;
var lastInsertIDResult;
var mySQLresult;
var intResultSize;
var intSuccessfullInserts = 0;
var strDateTime = DateUtil.getCurrentDate('yyyyMMddHHmmss');
var strLastSyncDateTime = $('strLastSyncDateTime');  //Last DateTime Sync was ran
var strMostRecentStatusDate;					//The most recent status date of stain orders that were uploaded.  If some of the database calls fail, this is where to pick back up.
var strDBInsertStatus;
var strTimeToComplete;
var strSyncStatus;
var intLastSyncID;
const strMYSQLUserName = configurationMap.get('MYSQLUserName');
const strMYSQLPassword = configurationMap.get('MYSQLPassword');
const strMYSQLJDBCConnection = configurationMap.get('MYSQLJDBCConnection');
const strMYSQLJDBCDriver = configurationMap.get('MYSQLJDBCDriver');
const strSybaseUserName = configurationMap.get('SybaseUserName');
const strSybasePassword = configurationMap.get('SybasePassword');
const strSybaseJDBCConnection = configurationMap.get('SybaseJDBCConnection');
const strSybaseJDBCDriver = configurationMap.get('SybaseJDBCDriver');



		//Get Stain Orders that are not matched, but match to on specimen and part (so only not matched on block)
		//Need to be more specific - get any that have a more recent status than last sync.

		strSQL1 = "Select copath_p_stainprocess.specimen_id, \
									copath_p_stainprocess.part_inst, \
									copath_p_stainprocess.block_inst, \
									copath_p_stainprocess.stain_inst, \
									tblBlock.BlockDesignator \
								FROM copath_p_stainprocess, \
									tblBlock \
								WHERE _blockstaininstid is null AND \
		  						copath_p_stainprocess.specimen_id = tblBlock.specimen_id AND \
		  						copath_p_stainprocess.part_inst = tblBlock.PartInst AND \
									copath_p_stainprocess.block_inst <> '0' AND \
									status_date > '" + strLastSyncDateTime + "';"
		logger.debug("JS Writer:" + strSQL1);
try {
  dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword);
  orphanStainResult = dbConnMYSQL.executeCachedQuery(strSQL1);

  //Loop set result size for loop.  Loop after dbconn established.


  intResultSize = orphanStainResult.size();

  //Insert into OPENLIS Mysql=======================

  try {
    dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection(strSybaseJDBCDriver, strSybaseJDBCConnection, strSybaseUserName, strSybasePassword)

    if (intResultSize > 0) {
      for (var i = 0; i < intResultSize; i++) {
        //For each stin that is not matched get Block Desig Label
        orphanStainResult.next();

        //try Catch within loop.  orphanStainResult.getString Errors when block inst is null.

        try {

          //Keys off of status updates. Need to cascade status updates to slides
          strSQL2 = "select blkdesig_label \
													from p_block \
													where specimen_id = '" + orphanStainResult.getString('specimen_id') + "' AND \
													part_inst = '" + orphanStainResult.getString('part_inst') + "' AND \
													block_inst = '" + orphanStainResult.getString('block_inst') + "'"

          logger.debug(strSQL2);
          var blockDesLabelResult = dbConnCoPath.executeCachedQuery(strSQL2);


          //Update copath_p_stainprocess with update block BlockDesignator
          //Only update if
          if (blockDesLabelResult.size() > 0) {

            var strNewBlockDesigSQL = "UPDATE `OPENLIS`.`copath_p_stainprocess` \
																								SET \
																								`_blockdesig_label` ='" + blockDesLabelResult.getString('blkdesig_label') + "' \
																								WHERE `specimen_id` = '" + orphanStainResult.getString('specimen_id') + "' AND \
																								 			`part_inst` = '" + orphanStainResult.getString('part_inst') + "' AND \
																											`stain_inst` = '" + orphanStainResult.getString('stain_inst') + "' AND \
																											`block_inst` = '" + orphanStainResult.getString('block_inst') + "';"

            try {

              lastInsertIDResult = dbConnMYSQL.executeCachedQuery(strNewBlockDesigSQL);
            } catch (err) {
              logger.debug("ERROR- MYSQL Insert - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL2: " + strSQL2 + "SQL strSQLGetLastInsertID: " + strSQLGetLastInsertID);

            }

          }



        } catch (err) {
          //GetStringError
          logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL2:" + strSQL2);
          logger.debug("GetString Error");
        } finally {


        }
      } //End For loop
    } //End if slide orders exist.


  } //End try
  catch (err) {
    logger.debug("ERROR- db error - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL2: " + strSQL2 + "SQL strSQLGetLastInsertID: " + strSQLGetLastInsertID);
  } //End catch
  finally {
    if (dbConnCoPath) {
			dbConnCoPath.close();
    }
  }

  //logger.info( orphanStainResult.toString() );
  //channelMap.put ("strSpecimenID", strSpecimenID);

} finally {
  if (dbConnMYSQL) {
		dbConnMYSQL.close();

  }
}
