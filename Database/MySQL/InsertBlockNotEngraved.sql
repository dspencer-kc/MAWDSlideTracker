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


	'LOOP')
    
    	ON DUPLICATE KEY UPDATE


	    `BlockID`= `BlockID`; #BlockComment and end


    Mirth Javascript:

               var strInsertNewBlockSQL = "INSERT INTO `tblBlock` \
            (`BlockID`, \
            `SpecNumFormatted`, \
            `PatientName`, \
             `SpecimenYear`, \
            `SpecimenNumber`, \
            `Specimen_id`, \
            `PartInst`, \
            `BlockInst`, \
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
            `Audit`, \
            `BlockComment`) \
            VALUES \
            ( \
            CONCAT('HBLK','" + blockInfoResult.getString('specnum_formatted') + "','_','" + blockInfoResult.getString('part_designator') + "','_','" + blockInfoResult.getString('blkdesig_label') + "'), \
            '" + blockInfoResult.getString('specnum_formatted') + "', \
            " + strPatientFullname + ",  \
            '" + blockInfoResult.getString('specnum_year') + "',  \
            '" + blockInfoResult.getString('specnum_num') + "',  \
            '" + strSpecId + "',  \
            '" + blockInfoResult.getString('part_inst') + "',  \
            '" + blockInfoResult.getString('block_inst') + "',  \
            '" + blockInfoResult.getString('parttype_id') + "',  \
            " + strPartDescription + ",  \
            '" + blockInfoResult.getString('datetime_taken') + "',  \
            '" + blockInfoResult.getString('datetime_rec') + "',  \
            '" + blockInfoResult.getString('protocol_id') + "',  \
            '" + blockInfoResult.getString('blocksequence') + "',  \
            '" + blockInfoResult.getString('partsequence') + "', \
            " + strPartComment + ",  \
            '" + blockInfoResult.getString('pieces_num') + "',  \
            '" + blockInfoResult.getString('wkdept_id') + "',  \
            '" + blockInfoResult.getString('requestclass_id') + "',  \
            '" + blockInfoResult.getString('blkdesig_label') + "',  \
            '" + blockInfoResult.getString('part_designator') + "',  \
            0,  \
            '" + strDateTime + " Block not engraved, added from Stain Order\',  \
            " + strBlockComment + ") \
                	ON DUPLICATE KEY UPDATE \
	    `BlockID`= `BlockID`;"
