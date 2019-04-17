Select DISTINCT copath_p_stainprocess.specimen_id,
		copath_p_stainprocess.part_inst,
		copath_p_stainprocess.block_inst,
        copath_p_stainprocess.stain_inst
	FROM copath_p_stainprocess,
			tblBlock
	WHERE _blockstaininstid is null AND
		  copath_p_stainprocess.specimen_id = tblBlock.specimen_id AND
		  copath_p_stainprocess.part_inst = tblBlock.PartInst AND
			copath_p_stainprocess.block_inst <> '0' and
copath_p_stainprocess.status_date > '2019-04-15 11:34:08'
