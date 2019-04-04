var dbConnMYSQL;
var strSpecimenID = "Empty";
var strSQL;
var result;
var strBlockNotes;
var strDateOfService;
var strDateTime = DateUtil.getCurrentDate('yyyyMMddHHmmss');
const strMYSQLUserName = configurationMap.get('MYSQLUserName');
const strMYSQLPassword = configurationMap.get('MYSQLPassword');
const strMYSQLJDBCConnection = configurationMap.get('MYSQLJDBCConnection');
const strMYSQLJDBCDriver = configurationMap.get('MYSQLJDBCDriver');

//Get Specimen ID
strSpecimenID = channelMap.get("strSpecimenID");



//Clean up Null for DateOfService
//strDateOfService = $('strDateTaken');
//if (strDateOfService == 'null') {
//strDateOfService = "";
//}


try {
  dbConnMYSQL = DatabaseConnectionFactory.createDatabaseConnection(strMYSQLJDBCDriver, strMYSQLJDBCConnection,strMYSQLUserName,strMYSQLPassword);

  strSQL = "INSERT INTO `tblBlock` \
			(`BlockID`, \
			`Hopper`, \
			`WorkstationID`, \
			`SpecNumFormatted`, \
			`PatientName`, \
			`SpecimenYear`, \
			`SpecimenNumber`, \
			`Template`, \
			`Specimen_id`, \
			`DateTimeEngraved`, \
			`PartInst`, \
			`BlockInst`, \
			`WhoEngraved`, \
			`PartType`, \
			`PartDescription`, \
			`DateOfService`, \
			`DateReceived`, \
			`Protocol`, \
			`Sequence`, \
			`PartSequence`, \
			`PartComment`, \
			`Pieces`, \
			`BlockDept`, \
			`RequestClass`, \
			`BlockDesignator`, \
			`PartDesignator`, \
			`TimesEngraved`, \
			`LastTimeEngraved`, \
			`Audit`, \
			`BlockComment`) \
		VALUES \
			('" + $('strBlockID') + "', \
			'" + $('strHopper') + "', \
			'" + $('strWorkstationID') + "', \
			'" + $('strSpecNumFormatted') + "', \
			'" + $('strPatientName') + "', \
			'" + $('strSpecYear') + "', \
			'" + $('strSpecNum') + "', \
			'" + $('strTemplate') + "', \
			'" + strSpecimenID + "', \
			'" + strDateTime + "', \
			'" + $('intPartInst') + "', \
			'" + $('intBlockInst') + "', \
			'" + $('strWhoEngraved') + "', \
			'" + $('strPartType') + "', \
			'" + $('strPartDesc') + "', \
			'" + $('strDateTaken') + "', \
			'" + $('strDateReceived') + "', \
			'" + $('strProtocolID') + "', \
			'" + $('intBlockSequence') + "', \
			'" + $('intPartSequence') + "', \
			'" + $('strPartComment')  + "', \
			'" + $('intBlockPieces') + "', \
			'" + $('strBlockDept') + "', \
			'" + $('strRequestClass') + "', \
			'" + $('strBlockLabel') + "', \
			'" + $('strSpecLabel') + "', \
			1, \
			'" + strDateTime + "', \
               '" + strDateTime + " cassette printed by: " + $('strWhoEngraved')+ " at "+ $('strWorkstationID') + " on hopper "+ $('strHopper') +".', \
			'" + $('strBlockComment') + "') \
			ON DUPLICATE KEY UPDATE \
			`Hopper`= '" + $('strHopper') + "', \
			`WorkstationID`= '" + ('strWorkstationID') + "', \
			`SpecNumFormatted`= '" + $('strSpecNumFormatted') + "', \
			`PatientName`= '" + $('strPatientName') + "', \
			`SpecimenYear`= '" + $('strSpecYear') + "', \
			`SpecimenNumber`= '" + $('strSpecNum')+ "', \
			`Template`= '" + $('strTemplate') + "', \
			`Specimen_id`= '" + strSpecimenID + "', \
			`DateTimeEngraved` = '" + strDateTime + "', \
			`PartInst` = '" + $('intPartInst') + "', \
			`BlockInst` = '" + $('intBlockInst') + "', \
			`WhoEngraved` = '" + $('strWhoEngraved') + "', \
			`PartType` = '" + $('strPartType') + "', \
			`PartDescription` = '" + $('strPartDesc') + "', \
			`DateOfService` = '" + $('strDateTaken') + "', \
			`DateReceived` = '" + $('strDateReceived') + "', \
			`Protocol` = '" + $('strProtocolID') + "', \
			`Sequence` = '" + $('intBlockSequence') + "', \
			`PartSequence` = '" + $('intPartSequence') + "', \
			`PartComment` = '" + $('strPartComment') + "', \
			`Pieces` = '" + $('intBlockPieces') + "', \
			`BlockDept` = '" + $('strBlockDept') + "', \
			`RequestClass` = '" + $('strRequestClass') + "', \
			`BlockDesignator` = '" + $('strBlockLabel') + "', \
			`PartDesignator` = '" + $('strSpecLabel') + "', \
			`BlockComment` = '" + $('strBlockComment')  + "', \
			`TimesEngraved` = `TimesEngraved`+1, \
			`LastTimeEngraved` = '" + strDateTime  + "', \
			`BlockInstUpdatedCancelOldSlides` = IF(`BlockInst`=" + $('intBlockInst') + ", 'N', 'Y'), \
			`Audit` = CONCAT(`Audit`, ' #', '" + strDateTime + "', ' ', 'Cassette printed by: " + $('strWhoEngraved')+ " at "+ $('strWorkstationID') + " on hopper "+ $('strHopper') +".'), \
			`Notes` = \"Cassette printed more than once.  Printed again on: '" + strDateTime + "'.  Initial DateTime Engraved kept, other values have been updated.\";";

		//logger.debug("Insert Block SQL:" + strSQL);
		result = dbConnMYSQL.executeUpdate(strSQL);

}
catch(err) {
        logger.debug("Error Name:" + err.name + " Error Details: " + err + ". SQL:" + strSQL);
        //Catch Primary Key / Duplicate entries.
        //On Dup, update existing

        }


finally {
	if (dbConnMYSQL) {
		dbConnMYSQL.close();
	}
}
