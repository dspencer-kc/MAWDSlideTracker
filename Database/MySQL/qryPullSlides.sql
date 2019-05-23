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
        tblSlides.Status
FROM   tblSlides  
WHERE  (( ( tblSlides.BlockID ) = 'HBLKD18-99999_A_1' ));