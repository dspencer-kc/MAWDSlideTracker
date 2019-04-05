
//Sync Slide Orders that do not match due to block being deleted.
//  Not matched because block_inst gets updated when new block is created.


var dbConnMYSQL;
var dbConnCoPath;
var strSpecimenID = "empty";
var strSQL;
var strSQL1;
var strSQL2;
var result;
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
		strSQL1 = "Select copath_p_stainprocess.specimen_id, \
									copath_p_stainprocess.part_inst, \
									copath_p_stainprocess.block_inst, \
									copath_p_stainprocess.stain_inst, \
									tblBlock.BlockDesignator \
								FROM copath_p_stainprocess, \
									tblBlock \
								WHERE _blockstaininstid is null AND \
		  						copath_p_stainprocess.specimen_id = tblBlock.specimen_id AND \
		  						copath_p_stainprocess.part_inst = tblBlock.PartInst;" \
		//logger.debug("JS Writer:" + strSQL1);
try {
	dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection,strMYSQLUserName,strMYSQLPassword);
	//dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection(strJDBCDriver, strJDBCPath,'report','report');
	result = dbConnCoPath.executeCachedQuery(strSQL1);

	//Loop set result size for loop.  Loop after dbconn established.


	intResultSize = result.size();

			//Insert into OPENLIS Mysql=======================

			try {
				dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection,strMYSQLUserName,strMYSQLPassword);


				if(intResultSize>0)
				{
				for(var i = 0; i < intResultSize; i++)
					{
					//logger.debug("i: " + i.toString() + "Entry point.");
					result.next();

						//try Catch within loop.  result.getString Errors when block inst is null.

						try{

							//GetVariables That need cleaned up
							var strLogComment = result.getString('log_comment');
							strLogComment = escape(strLogComment);  //Need to clean up later.

							//Keys off of status updates. Need to cascade status updates to slides

								strSQL2 = "INSERT INTO `copath_p_stainprocess` \
									(`specimen_id`, \
									`part_inst`, \
									`stain_inst`, \
									`stainprocess_id`, \
									`order_date`, \
									`orderedby_id`, \
									`slidecount`, \
									`stainstatus_id`, \
									`status_date`, \
									`label_text`, \
									`stainproclog_id`, \
									`log_comment`, \
									`requestclass_id`, \
									`block_inst`, \
									`ppath_link`, \
									`wkdept_id`, \
									`unstained_available`, \
									`sequence`, \
									`engraver_label_type_id`, \
									`outside_block_id`, \
									`outside_part`, \
									`outside_date`, \
									`outside_patient_id`, \
									`outside_patient_name`, \
									`who_ordered`, \
									`dttm_engraved`, \
									`status_comment`, \
									`status_who_id`, \
									`slidenum`, \
									`unstain_used`, \
									`orig_unstain_id`, \
									`obs_sequence_255`, \
									`this_col_available`, \
									`_lastSyncTime`, \
									`_originalSyncTime`, \
									`_timesUpdated`) \
								VALUES \
									('" + result.getString('specimen_id') + "', \
									'" + result.getString('part_inst') + "', \
									'" + result.getString('stain_inst') + "', \
									'" + result.getString('stainprocess_id') + "', \
									'" + result.getString('order_date') + "', \
									'" + result.getString('orderedby_id') + "', \
									'" + result.getString('slidecount') + "', \
									'" + result.getString('stainstatus_id') + "', \
									'" + result.getString('status_date') + "', \
									'" + result.getString('label_text') + "', \
									'" + result.getString('stainproclog_id') + "', \
									'" + strLogComment + "', \
									'" + result.getString('requestclass_id') + "', \
									'" + result.getInt('block_inst') + "', \
									'" + result.getString('ppath_link') + "', \
									'" + result.getString('wkdept_id') + "', \
									'" + result.getString('unstained_available') + "', \
									'" + result.getString('sequence') + "', \
									'" + result.getString('engraver_label_type_id') + "', \
									'" + result.getString('outside_block_id') + "', \
									'" + result.getString('outside_part') + "', \
									'" + result.getString('outside_date') + "', \
									'" + result.getString('outside_patient_id') + "', \
									'" + result.getString('outside_patient_name') + "', \
									'" + result.getString('who_ordered') + "', \
									'" + result.getString('dttm_engraved') + "', \
									'" + result.getString('status_comment') + "', \
									'" + result.getString('status_who_id') + "', \
									'" + result.getString('slidenum') + "', \
									'" + result.getString('unstain_used') + "', \
									'" + result.getString('orig_unstain_id') + "', \
									'" + result.getString('obs_sequence_255') + "', \
									'" + result.getString('this_col_available') + "', \
									'" + strDateTime + "', \
									'" + strDateTime + "', \
									'" + 1 + "') \
									ON DUPLICATE KEY UPDATE \
									`order_date`= '" + result.getString('order_date') + "', \
									`orderedby_id`= '" + result.getString('orderedby_id') + "', \
									`slidecount`= '" + result.getString('slidecount') + "', \
									`stainstatus_id`= '" + result.getString('stainstatus_id') + "', \
									`status_date`= '" + result.getString('status_date') + "', \
									`label_text`= '" + result.getString('label_text') + "', \
									`stainproclog_id`= '" + result.getString('stainproclog_id') + "', \
									`log_comment`= '" + strLogComment + "', \
									`requestclass_id`= '" + result.getString('requestclass_id') + "', \
									`ppath_link`= '" + result.getString('ppath_link') + "', \
									`wkdept_id`= '" + result.getString('wkdept_id') + "', \
									`unstained_available`= '" + result.getString('unstained_available') + "', \
									`sequence`= '" + result.getString('sequence') + "', \
									`engraver_label_type_id`= '" + result.getString('engraver_label_type_id') + "', \
									`outside_block_id`= '" + result.getString('outside_block_id') + "', \
									`outside_part`= '" + result.getString('outside_part') + "', \
									`outside_date`= '" + result.getString('outside_date') + "', \
									`outside_patient_id`= '" + result.getString('outside_patient_id') + "', \
									`outside_patient_name`= '" + result.getString('outside_patient_name') + "', \
									`who_ordered`= '" + result.getString('who_ordered') + "', \
									`dttm_engraved`= '" + result.getString('dttm_engraved') + "', \
									`status_comment`= '" + result.getString('status_comment') + "', \
									`status_who_id`= '" + result.getString('status_who_id') + "', \
									`slidenum`= '" + result.getString('slidenum') + "', \
									`unstain_used`= '" + result.getString('unstain_used') + "', \
									`orig_unstain_id`= '" + result.getString('orig_unstain_id') + "', \
									`obs_sequence_255`= '" + result.getString('obs_sequence_255') + "', \
									`this_col_available`= '" + result.getString('this_col_available') + "', \
									`_lastSyncTime`= '" + strDateTime + "', \
									`_timesUpdated`= `_timesUpdated`+1;";

									//logger.debug(strSQL2);

						}
						catch(err){
							//GetStringError
							logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL2:" + strSQL2);
							logger.debug("GetString Error");
						}
						finally{
						}


										//Update database
										mySQLresult = dbConnMYSQL.executeUpdate(strSQL2);
										strDBInsertStatus = mySQLresult.toString();
										strMostRecentStatusDate = result.getString('status_date');
										strSyncStatus = "Success";
										intSuccessfullInserts++;


      								} //End For loop


						//Calculate query time, no idea if this is accurate.FIXME:
						strTimeToComplete = Math.abs(DateUtil.getCurrentDate('yyyyMMddHHmmss') - strDateTime);

					//	logger.debug("1");
						//Log that sync was completed
						strSQL = "INSERT INTO `tblSyncStatus` \
							(`syncTime`, \
							`status`, \
							`mostrecentstainstatus`, \
							`rowsinserted`, \
							`totalsynctime`) \
						VALUES \
							('" + strDateTime + "', \
							'" + strSyncStatus + "', \
							'" + strMostRecentStatusDate + "', \
							" + intSuccessfullInserts.toString() + ", \
							'" + strTimeToComplete + "');";

				mySQLresult = dbConnMYSQL.executeUpdate(strSQL);

				//Save syncid  to varialbe for build stain orders

				try{
				strSQLGetLastInsertID = "SELECT LAST_INSERT_ID() as lastinsertid;";
				lastInsertIDResult = dbConnMYSQL.executeCachedQuery(strSQLGetLastInsertID);
				lastInsertIDResult.next();
				intLastSyncID = lastInsertIDResult.getString('lastinsertid');
				channelMap.put ("intLastSyncID", intLastSyncID);
				}
				catch(err) {
			        logger.debug("ERROR- MYSQL Insert - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL2: " + strSQL2 + "SQL strSQLGetLastInsertID: " + strSQLGetLastInsertID );
			        } //End catch


				//Log Sync Completed
				logger.info("Sync Completed, " + intSuccessfullInserts.toString() + " records synced.  Completed in " + strTimeToComplete + " millisecond(s).  The most recent Stain Status date inserted is:" + strMostRecentStatusDate + " SyncID: " + intLastSyncID);

								}//End if slide orders exist.
				else { 	//No records to insert
				strSyncStatus = "No stain updates to insert";
				strMostRecentStatusDate = strLastSyncDateTime;

				//Log Sync Completed
				strTimeToComplete = Math.abs(DateUtil.getCurrentDate('yyyyMMddHHmmss') - strDateTime);
				//logger.debug("Sync Completed - No new orders, " + intSuccessfullInserts.toString() + " records synced.  Completed in " + strTimeToComplete + " millisecond(s).  The most recent Stain Status date inserted is:" + strMostRecentStatusDate);


					}//End Else


			} //End try
			catch(err) {
			        logger.debug("ERROR- MYSQL Insert - Error Name:" + err.name + " Error Details: " + err + ".  Prior to this, " + intSuccessfullInserts.toString() + " were inserted. Status:" + strDBInsertStatus + " SQL: " + strSQL + " SQL2: " + strSQL2 + "SQL strSQLGetLastInsertID: " + strSQLGetLastInsertID );
			        } //End catch



			finally {
				if (dbConnMYSQL) {
					dbConnMYSQL.close();
				}
			}

	//logger.info( result.toString() );
	//channelMap.put ("strSpecimenID", strSpecimenID);

} finally {
	if (dbConnCoPath) {
		dbConnCoPath.close();
	}
}
