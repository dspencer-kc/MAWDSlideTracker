var dbConnCoPath;
var dbConnMYSQL;
var strSpecimenID = "empty";
var strSQL;
var result;
var strDateTime = DateUtil.getCurrentDate('yyyyMMddHHmmss');

//Get Specimen ID
strSQL = "SELECT c_specimen.specimen_id \
		FROM c_specimen \
		WHERE (((c_specimen.specnum_formatted)='" + $('strSpecNumFormatted') + "') AND ((c_specimen.specnum_year)=" + $('strSpecYear') + ") AND ((c_specimen.specnum_num)=" + $('strSpecNum') + "))";
		//logger.debug(strSQL);
try {

	dbConnCoPath = DatabaseConnectionFactory.createDatabaseConnection('net.sourceforge.jtds.jdbc.Driver','jdbc:jtds:sybase://10.24.4.18:5000/coplive','report','report');
	result = dbConnCoPath.executeCachedQuery(strSQL);	
	result.next();
	strSpecimenID  = result.getString(1);
	//logger.info(strSpecimenID);
	//logger.info( result.toString() );
	channelMap.put ("strSpecimenID", strSpecimenID);

	//=================Get Part Info===========================
	strSQL = "SELECT p_part.part_inst, p_part.parttype_id, p_part.part_description, p_part.datetime_taken, p_part.datetime_rec, p_part.sequence, p_part.comment, p_part.protocol_id \
			FROM p_part \
			WHERE (p_part.specimen_id='" + strSpecimenID + "') AND (p_part.part_designator='" + $('strSpecLabel') + "')";
	//logger.debug("Get Part Info SQL:" + strSQL);

	result = dbConnCoPath.executeCachedQuery(strSQL);	
	result.next();

	//Sanitize Comments and get variables needed later
	var strComment = result.getString('comment');
	strComment = escape(strComment);  //Need to clean up later.
	var strPartDesc = result.getString('part_description');
	strPartDesc = escape(strPartDesc);  //Need to clean up later.
	var intPartInst = result.getInt('part_inst');
	//What happens if null? See GV18-561
	var strDateReceived = result.getString('datetime_rec');
	
	channelMap.put ("intPartInst", intPartInst);
	channelMap.put ("strPartType", result.getString('parttype_id'));
	channelMap.put ("strPartDesc", strPartDesc);
	channelMap.put ("strDateTaken", result.getString('datetime_taken'));
	channelMap.put ("strDateReceived", strDateReceived);
	channelMap.put ("intPartSequence", result.getInt('sequence'));
	channelMap.put ("strPartComment", strComment);
	channelMap.put ("strProtocolID", result.getString('protocol_id'));

	//=================Get Block Info===========================
	strSQL = "SELECT p_block.block_inst, p_block.pieces_num, p_block.wkdept_id, p_block.sequence, p_block.requestclass_id, p_block.log_comment, p_block.who_engr_queued \
			FROM p_block \
			WHERE (p_block.specimen_id='" + strSpecimenID + "') AND (p_block.part_inst='" + intPartInst + "') AND (p_block.blkdesig_label='" + $('strBlockLabel') + "')";
	//logger.debug("Get Block Info SQL:" + strSQL);

	result = dbConnCoPath.executeCachedQuery(strSQL);	
	result.next();

	//Sanitize Comments
	var strBlockComment = result.getString('log_comment');
	strComment = escape(strComment);  //Need to clean up later.
	channelMap.put ("intBlockInst", result.getInt('block_inst'));
	channelMap.put ("intBlockPieces", result.getInt('pieces_num'));
	channelMap.put ("strBlockDept", result.getString('wkdept_id'));
	channelMap.put ("intBlockSequence", result.getInt('sequence'));
	channelMap.put ("strRequestClass", result.getString('requestclass_id'));
	channelMap.put ("strBlockComment", strBlockComment);
	channelMap.put ("strWhoEngraved", result.getString('who_engr_queued'));
	
}
catch(err) {
        logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL:" + strSQL);
        
        }
	
	
	

 finally {
	if (dbConnCoPath) { 
		dbConnCoPath.close();
	}
}