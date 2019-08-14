SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
FROM (SELECT subTblSlides.BlockID AS subBlockID  
      FROM tblSlides as subTblSlides
      WHERE SlideDistributionID = {$slidedistrid}
      GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
;