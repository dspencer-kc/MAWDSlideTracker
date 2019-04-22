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
var strLastSyncDateTime = $('strLastSyncDateTime'); //Last DateTime Sync was ran
//var strLastSyncDateTime = '2019-04-15 11:34:08'; //Last DateTime Sync was ran
var strMostRecentStatusDate; //The most recent status date of stain orders that were uploaded.  If some of the database calls fail, this is where to pick back up.
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
var strSyncID = $('intLastSyncID');


		//If no syncid, set as 0.
		if (isNaN(strSyncID))
		{
			strSyncID = 0;
		}
		else if (strSyncID == "")
		{
			strSyncID = 0
		}




//Get Stain Orders that are not matched, but match to on specimen and part (so only not matched on block)
//Need to be more specific - get any that have a more recent status than last sync.

strSQL1 = "Select DISTINCT copath_p_stainprocess.specimen_id, \
		copath_p_stainprocess.part_inst, \
		copath_p_stainprocess.block_inst, \
        copath_p_stainprocess.stain_inst \
	FROM copath_p_stainprocess, \
			tblBlock \
	WHERE _blockstaininstid is null AND \
		  copath_p_stainprocess.specimen_id = tblBlock.specimen_id AND \
		  copath_p_stainprocess.part_inst = tblBlock.PartInst AND \
			copath_p_stainprocess.block_inst <> '0' and \
copath_p_stainprocess.status_date > '" + strLastSyncDateTime + "';"
//logger.debug("JS Writer:" + strSQL1);
try {
  dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword);
  orphanStainResult = dbConnMYSQL.executeCachedQuery(strSQL1);

  //Loop set result size for loop.  Loop after dbconn established.


  intResultSize = orphanStainResult.size();

  //logger.debug('Line 61')
  //Insert into OPENLIS Mysql=======================

  try {
    dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection(strSybaseJDBCDriver, strSybaseJDBCConnection, strSybaseUserName, strSybasePassword)

    if (intResultSize > 0) {
      //for (var i = 0; i < intResultSize; i++) {
      for (var i = 0; i < intResultSize; i++) {
        //For each stin that is not matched get Block Desig Label
        orphanStainResult.next();

        //try Catch within loop.  orphanStainResult.getString Errors when block inst is null.

        try {

          //Keys off of status updates. Need to cascade status updates to slides
          var strSQL2 = ""
          var strSpecId = orphanStainResult.getString('specimen_id')
          var strPartInt = orphanStainResult.getString('part_inst')
          var strBlockInt = orphanStainResult.getString('block_inst')

          strSQL2 = "select blkdesig_label \
										from p_block \
										where specimen_id = '" + strSpecId + "' AND \
										part_inst = '" + strPartInt + "' AND \
										block_inst = '" + strBlockInt + "'"

          //What if block inst = 0??
          var blockDesLabelResult = dbConnCoPath.executeCachedQuery(strSQL2);

          //Update copath_p_stainprocess with update block BlockDesignator
          //Only update if
          if (blockDesLabelResult.size() > 0) {
            //Load first restult
            blockDesLabelResult.next();
            var strBlkDesigLabel = blockDesLabelResult.getString('blkdesig_label')

            var strNewBlockDesigSQL = "UPDATE `OPENLIS`.`copath_p_stainprocess` \
							SET \
						`_blockdesig_label` ='" + strBlkDesigLabel + "' \
						WHERE `specimen_id` = '" + orphanStainResult.getString('specimen_id') + "' AND \
						`part_inst` = '" + orphanStainResult.getString('part_inst') + "' AND \
						`stain_inst` = '" + orphanStainResult.getString('stain_inst') + "' AND \
						`block_inst` = '" + orphanStainResult.getString('block_inst') + "';"

            //logger.debug("strNewBlockDesigSQL: " + strNewBlockDesigSQL);
            try {

              lastInsertIDResult = dbConnMYSQL.executeUpdate(strNewBlockDesigSQL);
            } catch (err) {
              logger.debug("ERROR- MYSQL Insert - Error Name:" + err.name + " Error Details: " + err + ". SQL: " + strNewBlockDesigSQL);

            }

          }



        } catch (err) {
          //GetStringError
          logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL2:" + strSQL2);
          logger.debug("Catch 116");
        } finally {


        }
      } //End For loop

			//Build Stain Orders off of block Desig
			strSQL = "INSERT INTO tblSlides \
								(slideid, \
								 blockid, \
								 blockstaininstid, \
								 partinst, \
								 blockinst, \
								 staininst, \
								 slideinst, \
								 slidecount, \
								 stainid, \
								 blockdesignator, \
								 partdesignator, \
								 stainorderdate, \
								 orderingpath, \
								 department, \
								 stainlabel, \
								 patient, \
								 SiteLabel, \
								 AccessionID, \
					 LastTimeUpdatedFromCoPath,  \
					 SyncID,  \
					 specimen_id)  \
			SELECT CONCAT(\"HSLD\",tblBlock.SpecNumFormatted,\"_\",tblBlock.PartDesignator,\"_\",tblBlock.BlockDesignator,\".\",copath_p_stainprocess.stain_inst,\".\",tblIntegers.integers) AS SlideId, \
						 tblBlock.blockid, \
						 CONCAT(tblBlock.SpecNumFormatted,\"_\",tblBlock.PartDesignator,\"_\",tblBlock.BlockDesignator,\".\",copath_p_stainprocess.stain_inst) AS BlockStainInstId, \
						 tblBlock.partinst, \
						 tblBlock.blockinst, \
						 copath_p_stainprocess.stain_inst, \
						 tblIntegers.integers                                        AS SlideInst, \
						 copath_p_stainprocess.slidecount, \
						 copath_p_stainprocess.stainprocess_id, \
						 tblBlock.blockdesignator, \
						 tblBlock.partdesignator, \
						 copath_p_stainprocess.order_date, \
						 copath_p_stainprocess.orderedby_id, \
						 copath_p_stainprocess.wkdept_id, \
						 copath_p_stainprocess.label_text, \
						 tblBlock.patientname, \
						 \"MAWD\", \
						 tblBlock.SpecNumFormatted, \
					 NOW(), \
					 " + strSyncID +", \
					 tblBlock.Specimen_id \
			FROM   tblIntegers, \
						 tblBlock \
						 INNER JOIN copath_p_stainprocess \
										 ON ( tblBlock.specimen_id = copath_p_stainprocess.specimen_id ) \
												AND ( tblBlock.partinst = copath_p_stainprocess.part_inst ) \
												AND ( tblBlock.BlockDesignator = copath_p_stainprocess._blockdesig_label ) \
												WHERE   ( tblIntegers.integers  <= copath_p_stainprocess.slidecount ) AND \
									(copath_p_stainprocess._blockstaininstid  IS NULL)  AND \
									 (copath_p_stainprocess._lastSyncTime > '" + $('strLastSyncDateTime') + "') \
			ON DUPLICATE KEY UPDATE \
								 `blockid` = tblBlock.blockid, \
								 `blockstaininstid` = CONCAT(tblBlock.SpecNumFormatted, \"_\", tblBlock.PartDesignator, \"_\", tblBlock.BlockDesignator, \".\", copath_p_stainprocess.stain_inst), \
								 `partinst` = tblBlock.partinst, \
								 `blockinst` = tblBlock.blockinst, \
								 `staininst` = copath_p_stainprocess.stain_inst, \
								 `slideinst` = tblIntegers.integers, \
								 `slidecount` = copath_p_stainprocess.slidecount, \
								 `stainid` = copath_p_stainprocess.stainprocess_id, \
								 `blockdesignator` = tblBlock.blockdesignator, \
								 `partdesignator` = tblBlock.partdesignator, \
								 `stainorderdate` = copath_p_stainprocess.order_date, \
								 `orderingpath` = copath_p_stainprocess.orderedby_id, \
								 `department` = copath_p_stainprocess.wkdept_id, \
								 `stainlabel` = copath_p_stainprocess.label_text, \
								 `patient` = tblBlock.patientname, \
								 `SiteLabel` = \"MAWD\", \
								 `AccessionID` = tblBlock.SpecNumFormatted, \
					 `specimen_id` = tblBlock.Specimen_id, \
					 `LastTimeUpdatedFromCoPath` = NOW(), \
					 `TimesUpdatedFromCoPath` = `TimesUpdatedFromCoPath`+1, \
						`SyncID` = " + strSyncID +", \
					 `Note` = \"Orphaned slide updated based off of part designator on: " + strDateTime + ".  Slide and block values have been updated.\";";

			//logger.debug("SQL:" + strSQL);
		dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword)
			result = dbConnMYSQL.executeUpdate(strSQL);

			//Update copath_p_stainprocess w synced Slides
			strSQL = "UPDATE tblSlides \
					 INNER JOIN copath_p_stainprocess  \
									 ON (tblSlides.BlockDesignator = copath_p_stainprocess._blockdesig_label) \
											AND ( tblSlides.StainInst = copath_p_stainprocess.stain_inst ) \
											AND ( tblSlides.PartInst = copath_p_stainprocess.part_inst ) \
											AND ( tblSlides.Specimen_id = copath_p_stainprocess.specimen_id ) \
							SET    copath_p_stainprocess._blockstaininstid = tblSlides.BlockStainInstID, \
							copath_p_stainprocess._syncid = "+ strSyncID +", \
					 	copath_p_stainprocess._status = concat(\"Block Synced Slides Built \",NOW()) \
					 	WHERE  (( ( copath_p_stainprocess._blockstaininstid ) IS NULL )) \
										AND (copath_p_stainprocess._lastSyncTime > '" + strLastSyncDateTime + "') \; ";

		result = dbConnMYSQL.executeUpdate(strSQL);

    } //End if slide orders exist.


  } //End try
  catch (err) {
    logger.debug("ERROR- db error - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL1: " + strSQL1 + " SQL2: " + strSQL2);
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
