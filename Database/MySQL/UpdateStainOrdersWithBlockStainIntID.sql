UPDATE tblSlides 
     INNER JOIN copath_p_stainprocess
             ON (tblSlides.BlockDesignator = copath_p_stainprocess._blockdesig_label)
                AND ( tblSlides.StainInst = copath_p_stainprocess.stain_inst )
                AND ( tblSlides.PartInst = copath_p_stainprocess.part_inst )
                AND ( tblSlides.Specimen_id = copath_p_stainprocess.specimen_id )
                                      AND (copath_p_stainprocess._lastSyncTime > '2019-04-11 12:14:30.0')
        SET    copath_p_stainprocess._blockstaininstid = tblSlides.BlockStainInstID,
        copath_p_stainprocess._syncid = 1,
      copath_p_stainprocess._status = concat("Block Synced Slides Built",NOW())
      WHERE  (( ( copath_p_stainprocess._blockstaininstid ) IS NULL ));
