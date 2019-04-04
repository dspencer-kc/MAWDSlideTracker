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


	('HBLKMPS19-99999_A_9',


	'106',


	'MAWD.00-\B',


	'MPS19-99999',


	'TEST,TEST',


	'2019',


	'99999',


	'c:\copath\gendata\TEST\NORMAL.itl',


	'Empty',


	'20190403163409',


	'1',


	'9',


	'mwd26061',


	'mwd312',


	'Skin',


	'2019-03-19 15:11:00.0',


	'2019-03-19 15:11:00.0',


	'mwd003',


	'9',


	'1',


	'null',


	'1',


	'co4',


	'co3',


	'9',


	'A',


	1,


	'20190403163409',                '20190403163409 cassette printed by: mwd26061 at MAWD.00-\B on hopper 106.',


	'LOOP')


	ON DUPLICATE KEY UPDATE


	`Hopper`= '106',


	`WorkstationID`= 'strWorkstationID',


	`SpecNumFormatted`= 'MPS19-99999',


	`PatientName`= 'TEST,TEST',


	`SpecimenYear`= '2019',


	`SpecimenNumber`= '99999',


	`Template`= 'c:\copath\gendata\TEST\NORMAL.itl',


	`Specimen_id`= 'Empty',


	`DateTimeEngraved` = '20190403163409',


	`PartInst` = '1',


	`BlockInst` = '9',


	`WhoEngraved` = 'mwd26061',


	`PartType` = 'mwd312',


	`PartDescription` = 'Skin',


	`DateOfService` = '2019-03-19 15:11:00.0',


	`DateReceived` = '2019-03-19 15:11:00.0',


	`Protocol` = 'mwd003',


	`Sequence` = '9',


	`PartSequence` = '1',


	`PartComment` = 'null',


	`Pieces` = '1',


	`BlockDept` = 'co4',


	`RequestClass` = 'co3',


	`BlockDesignator` = '9',


	`PartDesignator` = 'A',


	`BlockComment` = 'LOOP',


	`TimesEngraved` = `TimesEngraved`+1,


	`LastTimeEngraved` = '20190403163409',


	`Audit` = CONCAT(`Audit`, ' #', '20190403163409', ' ', 'Cassette printed by: mwd26061 at MAWD.00-\B on hopper 106.'),


	`Notes` = "Cassette printed more than once.  Printed again on: '20190403163409'.  Initial DateTime Engraved kept, other values have been updated.";
