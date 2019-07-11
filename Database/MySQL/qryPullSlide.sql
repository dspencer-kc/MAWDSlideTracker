SELECT tblSlides.AccessionID,
		tblSlides.PartDesignator,
        tblSlides.BlockDesignator,
        tblSlides.Patient,
        tblSlides.StainLabel,
        tblSlides.ToBePrinted,
        tblSlides.SlideInst,
        tblSlides.slidecount,
        tblSlides.StainOrderDate,
        tblSlides.SiteLabel,
        tblSlides.SlideID,
        tblSlides.Status,
       tblCassetteColorHopperLookup.Color   AS SlideDistributionKeyword, 
       copath_c_d_person_1.initials         AS OrderPathInitials, 
       copath_c_d_department.name           AS StainDept
FROM   ((((tblSlides 
             INNER JOIN copath_p_stainprocess 
                     ON tblSlides.BlockStainInstID = 
                        copath_p_stainprocess._blockstaininstid) 
            INNER JOIN tblBlock 
                    ON tblSlides.BlockID = tblBlock.BlockID) 
           LEFT JOIN tblCassetteColorHopperLookup 
                  ON tblBlock.Hopper = tblCassetteColorHopperLookup.HopperID) 
        LEFT JOIN copath_c_d_person AS copath_c_d_person_1 
               ON copath_p_stainprocess.orderedby_id = copath_c_d_person_1.id) 
       LEFT JOIN copath_c_d_department 
              ON copath_p_stainprocess.wkdept_id = copath_c_d_department.id 
WHERE  (( ( tblSlides.BlockID ) = 'HBLKD18-99999_A_1' )); 
