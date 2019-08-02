UPDATE OPENLIS.tblSlides
SET
Status = 'InTrayPendingLocation',
Audit = CONCAT(Audit, 'Marked in tray:',NOW(), '.'),
SlideStatusID = '$itpl',
SlideDistributionID = 16
WHERE SlideID = 'HSLDMPS19-99999_A_9.11.1';
SELECT SlideID from tblSlides WHERE SlideStatusID = '$itpl';
SELECT Count(SlideID) AS 'SlidesInTray'
FROM tblSlides
WHERE SlideStatusID = '$itpl';
SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
FROM (SELECT subTblSlides.BlockID AS subBlockID  
      FROM tblSlides as subTblSlides
      WHERE subTblSlides.SlideStatusID = '$itpl'
      GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
;