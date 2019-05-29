//Sync Slide Orders that do not match due to block being deleted.
//  Not matched because block_inst gets updated when new block is created.


var dbConnMYSQL
var dbConnCoPath
var strSpecimenID = "empty"
var strSQL
var strSQL1
// var strSQL2 - set within try later
var stainOrderMissingBlockResult
var lastInsertIDResult
var mySQLresult
var intResultSize
var intSuccessfullInserts = 0
var strDateTime = DateUtil.getCurrentDate('yyyyMMddHHmmss')
var strLastSyncDateTime = $('strLastSyncDateTime'); //Last DateTime Sync was ran
var strMostRecentStatusDate; //The most recent status date of stain orders that were uploaded.  If some of the database calls fail, this is where to pick back up.
var strDBInsertStatus
var strTimeToComplete
var strSyncStatus
var intLastSyncID
const strMYSQLUserName = configurationMap.get('MYSQLUserName')
const strMYSQLPassword = configurationMap.get('MYSQLPassword')
const strMYSQLJDBCConnection = configurationMap.get('MYSQLJDBCConnection')
const strMYSQLJDBCDriver = configurationMap.get('MYSQLJDBCDriver')
const strSybaseUserName = configurationMap.get('SybaseUserName')
const strSybasePassword = configurationMap.get('SybasePassword')
const strSybaseJDBCConnection = configurationMap.get('SybaseJDBCConnection')
const strSybaseJDBCDriver = configurationMap.get('SybaseJDBCDriver')
var strSyncID = $('intLastSyncID')

// If no syncid, set as 0.
if (isNaN(strSyncID)) {
  strSyncID = 0 
} else if (strSyncID == "") {
  strSyncID = 0
}

// Get Get synced stain orders that still have not matched a block (copath_p_stain_process)

strSQL1 = "SELECT specimen_id, part_inst, block_inst FROM OPENLIS.copath_p_stainprocess where _lastSyncTime > '" + strLastSyncDateTime + "' AND _blockstaininstid is null and block_inst <> 0 ;"

// logger.debug("JS Writer:" + strSQL1);
try {
  dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword)
  stainOrderMissingBlockResult = dbConnMYSQL.executeCachedQuery(strSQL1)

  // Loop set result size for loop.  Loop after dbconn established.
  intResultSize = stainOrderMissingBlockResult.size()

  // logger.debug('Pre Sybase Select')
  // Lookup CoPath info

  try {
    dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection(strSybaseJDBCDriver, strSybaseJDBCConnection, strSybaseUserName, strSybasePassword)

    if (intResultSize > 0) {
      for (var i = 0; i < intResultSize; i++) {
        // For each stin that is not matched get Block Desig Label
        stainOrderMissingBlockResult.next()
        // try Catch within loop.  stainOrderMissingBlockResult.getString Errors when block inst is null.
        try {
          // Keys off of status updates. Need to cascade status updates to slides
          var strSQL2 = ""
          var strSpecId = stainOrderMissingBlockResult.getString('specimen_id')
          var strPartInt = stainOrderMissingBlockResult.getString('part_inst')
          var strBlockInt = stainOrderMissingBlockResult.getString('block_inst')

          strSQL2 = "SELECT \
          c_specimen.specnum_formatted, \
          r_pat_demograph.lastname, \
          r_pat_demograph.firstname, \
          r_pat_demograph.middlename, \
          c_specimen.specnum_year, \
          c_specimen.specnum_num, \
          p_part.parttype_id, \
          p_part.part_description, \
          p_part.datetime_taken, \
          p_part.datetime_rec, \
          p_part.protocol_id, \
          p_part.sequence, \
          p_part.comment, \
          p_part.label_designator, \
          p_block.pieces_num, \
          p_block.wkdept_id, \
          p_block.requestclass_id, \
          p_block.log_comment, \
          p_block.blkdesig_label, \
          p_block.specimen_id, \
          p_block.part_inst, \
          p_block.block_inst \
        FROM \
          ( \
            ( \
              p_part \
              RIGHT JOIN c_specimen ON p_part.specimen_id = c_specimen.specimen_id \
            ) \
            LEFT JOIN p_block ON ( \
              p_part.part_inst = p_block.part_inst \
            ) \
            AND ( \
              p_part.specimen_id = p_block.specimen_id \
            ) \
          ) \
          LEFT JOIN r_pat_demograph ON c_specimen.patdemog_id = r_pat_demograph.patdemog_id \
        WHERE \
          ( \
            ( \
              (p_block.specimen_id)= '" + strSpecId + "' \
            ) \
            AND ( \
              (p_block.part_inst)= '" + strPartInt + "' \
            ) \
            AND ( \
              (p_block.block_inst)= '" + strBlockInt + "' \
            ) \
          ) "

          var blockInfoResult = dbConnCoPath.executeCachedQuery(strSQL2)

          // Update tblBlocks with Block Info from Sybase
          // Only update if there is a result
          if (blockInfoResult.size() > 0) {
            // Load first restult otherwise error thrown
            blockInfoResult.next()
            var strBlkDesigLabel = blockInfoResult.getString('blkdesig_label')

            var strNewBlockDesigSQL = "UPDATE `OPENLIS`.`copath_p_stainprocess` \
							SET \
						`_blockdesig_label` ='" + strBlkDesigLabel + "' \
						WHERE `specimen_id` = '" + stainOrderMissingBlockResult.getString('specimen_id') + "' AND \
						`part_inst` = '" + stainOrderMissingBlockResult.getString('part_inst') + "' AND \
						`stain_inst` = '" + stainOrderMissingBlockResult.getString('stain_inst') + "' AND \
						`block_inst` = '" + stainOrderMissingBlockResult.getString('block_inst') + "';"

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
					 specimen_id, \
			 		 Audit)  \
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
					 tblBlock.Specimen_id, \
             			 CONCAT(\"Cassette Delete Detected, Slide inserted on new cassette: \", NOW()) \
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
					 `Note` = \"Orphaned slide updated based off of part designator on: " + strDateTime + ".  Slide and block values have been updated.\", \
		  			 `Audit` = CONCAT(`tblSlides`.`Audit`, \"Block Deletion Detected, Slide updated on new block:\",NOW(), \".\");"

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

  //logger.info( stainOrderMissingBlockResult.toString() );
  //channelMap.put ("strSpecimenID", strSpecimenID);

} finally {
  if (dbConnMYSQL) {
    dbConnMYSQL.close();

  }
}
