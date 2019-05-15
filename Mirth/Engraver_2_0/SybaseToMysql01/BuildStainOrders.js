var dbConnMYSQL
var strSQL
var result
var strDateTime = DateUtil.getCurrentDate('yyyyMMddHHmmss')
var strSyncID = $('intLastSyncID')
const strMYSQLUserName = configurationMap.get('MYSQLUserName')
const strMYSQLPassword = configurationMap.get('MYSQLPassword')
const strMYSQLJDBCConnection = configurationMap.get('MYSQLJDBCConnection')
const strMYSQLJDBCDriver = configurationMap.get('MYSQLJDBCDriver')

// If no syncid, set as 0.
if (isNaN(strSyncID)) {
  strSyncID = 0
} else if (strSyncID == "") {
  strSyncID = 0
}

// Sync New Slide Orders
try {
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
             CONCAT(\"Slide inserted: \", NOW()) \
	FROM   tblIntegers, \
	       tblBlock \
	       INNER JOIN copath_p_stainprocess \
	               ON ( tblBlock.specimen_id = copath_p_stainprocess.specimen_id ) \
	                  AND ( tblBlock.partinst = copath_p_stainprocess.part_inst ) \
	                  AND ( tblBlock.blockinst = copath_p_stainprocess.block_inst ) \
	WHERE  ( ( ( tblIntegers.integers ) <= copath_p_stainprocess.slidecount ) \
	         AND ( (( copath_p_stainprocess._blockstaininstid ) IS NULL) OR copath_p_stainprocess._lastSyncTime > '" + $('strLastSyncDateTime') + "') ) \
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
		   `Note` = \"Slide updated on: " + strDateTime + ".  Slide and block values have been updated.\", \
		   `Audit` = CONCAT(`tblSlides`.`Audit`, \"Slide updated:\",NOW(), \".\");"

  // logger.debug("SQL:" + strSQL);
  dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection, strMYSQLUserName, strMYSQLPassword)
  result = dbConnMYSQL.executeUpdate(strSQL)

  // Update p_stainprocess that block is matched and slides have been created.
		strSQL = "UPDATE tblSlides \
			       INNER JOIN copath_p_stainprocess  \
			               ON ( tblSlides.BlockInst = copath_p_stainprocess.block_inst ) \
			                  AND ( tblSlides.StainInst = copath_p_stainprocess.stain_inst ) \
			                  AND ( tblSlides.PartInst = copath_p_stainprocess.part_inst ) \
			                  AND ( tblSlides.Specimen_id = \
			                        copath_p_stainprocess.specimen_id ) \
			SET    copath_p_stainprocess._blockstaininstid = tblSlides.BlockStainInstID, \
				  copath_p_stainprocess._syncid = "+ strSyncID +", \
			       copath_p_stainprocess._status = concat(\"Block Synced Slides Built \",NOW()) \
			WHERE  (( ( copath_p_stainprocess._blockstaininstid ) IS NULL )); "

  result = dbConnMYSQL.executeUpdate(strSQL)

  // Update tblSlides Stain Status
  strSQL = "UPDATE ((tblSlides \
				         INNER JOIN copath_p_stainprocess \
				                 ON tblSlides.BlockStainInstID = \
				                    copath_p_stainprocess.`_blockstaininstid`) \
				        INNER JOIN copath_c_d_stainstatus \
				                ON copath_p_stainprocess.stainstatus_id = \
				                   copath_c_d_stainstatus.id) \
				       INNER JOIN tblUsers \
				               ON copath_p_stainprocess.status_who_id = tblUsers.id \
				SET    tblSlides.Status = `copath_c_d_stainstatus`.`name`, \
				       tblSlides.ToBePrinted = `copath_c_d_stainstatus`.`_ToBePrintedValue`, \
				       tblSlides.TimesPrinted = tblSlides.TimesPrinted \
				                                + `_TimesPrintedIncrease`, \
				       tblSlides.Audit = CONCAT(Audit,' Status Update: ',name,' By:',username,' at:',status_date)\
				 WHERE ( copath_p_stainprocess._lastSyncTime > '" + $('strLastSyncDateTime') + "');  "

  result = dbConnMYSQL.executeUpdate(strSQL)
} catch (err) {
  logger.debug('ERROR- MYSQL:' + err.name + ' Error Details: ' + err + '. SQL: ' + strSQL)
} finally {
  if (dbConnMYSQL) {
    dbConnMYSQL.close()
  }
}