SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
FROM (SELECT subTblSlides.BlockID AS subBlockID  
      FROM tblSlides as subTblSlides
      WHERE subTblSlides.SlideStatusID = '$itpl'
      GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
;