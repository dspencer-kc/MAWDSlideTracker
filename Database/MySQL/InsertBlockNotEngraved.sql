INSERT INTO `tblBlock`


	(`BlockID`,


	`Hopper`,


	`WorkstationID`,


	`SpecNumFormatted`,


	`PatientName`,


	`SpecimenYear`,


	`SpecimenNumber`,


	`Template`,


	`Specimen_id`,


	`DateTimeEngraved`,


	`PartInst`,


	`BlockInst`,


	`WhoEngraved`,


	`PartType`,


	`PartDescription`,


	`DateOfService`,


	`DateReceived`,


	`Protocol`,


	`Sequence`,


	`PartSequence`,


	`PartComment`,


	`Pieces`,


	`BlockDept`,


	`RequestClass`,


	`BlockDesignator`,


	`PartDesignator`,


	`TimesEngraved`,


	`LastTimeEngraved`,


	`Audit`,


	`BlockComment`)

	VALUES


	('HBLKMPS19-99999_A_9', #BlockID


	'106', #Hopper


	'MAWD.00-\B', #WorkstationID


	'MPS19-99999', #SpecNumFormatted


	'TEST,TEST', #PatientName


	'2019', #SpecimenYear


	'99999', #SpecimenNumber


	'c:\copath\gendata\TEST\NORMAL.itl', #Template


	'Empty', #Specimen_id


	'20190403163409', #DateTimeEngraved ie 20190403163409


	'1', #PartInst


	'9', #BlockInst


	'mwd26061', #WhoEngraved


	'mwd312', #PartType


	'Skin', #PartDescription


	'2019-03-19 15:11:00.0', #DateOfService


	'2019-03-19 15:11:00.0', #DateReceived


	'mwd003', #Protocol


	'9', #Sequence


	'1', #PartSequence


	'null', #PartComment


	'1', #Pieces


	'co4', #BlockDept


	'co3', #RequestClass


	'9', #BlockDesignator


	'A', #PartDesignator


	1, #TimesEngraved


	'20190403163409', #LastTimeEngraved
    
    '20190403163409 cassette printed by: mwd26061 at MAWD.00-\B on hopper 106.', #Audit


	'LOOP'); #BlockComment and end
