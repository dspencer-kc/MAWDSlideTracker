6:00 pm previous workday:

select DATE_ADD(DATE_FORMAT(DATE(CASE WEEKDAY(CURRENT_DATE) 
     WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
     WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
     WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
     ELSE SUBDATE(CURRENT_DATE,1) 
                        END), '%Y-%m-%d %T'), INTERVAL 18 HOUR) as dtPreviousDayBlockCountCutOff;

Get Slides and BLocks going back to previous cutoff:

SELECT SlideID,
       BlockID 
FROM tblSlides
INNER JOIN   tblSlideDistribution on tblSlides.SlideDistributionID = tblSlideDistribution.SlideDistributionID
WHERE tblSlideDistribution.DTReadyForCourier > DATE_ADD(DATE_FORMAT(DATE(CASE WEEKDAY(CURRENT_DATE) 
     WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
     WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
     WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
     ELSE SUBDATE(CURRENT_DATE,1) 
                        END), '%Y-%m-%d %T'), INTERVAL 18 HOUR)
                        ;


Get Blocks By Previous Cutoff
SELECT subTblSlides.BlockID AS subBlockID
FROM tblSlides as subTblSlides
INNER JOIN   tblSlideDistribution on subTblSlides.SlideDistributionID = tblSlideDistribution.SlideDistributionID
WHERE tblSlideDistribution.DTReadyForCourier > DATE_ADD(DATE_FORMAT(DATE(CASE WEEKDAY(CURRENT_DATE) 
     WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
     WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
     WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
     ELSE SUBDATE(CURRENT_DATE,1) 
     END), '%Y-%m-%d %T'), INTERVAL 18 HOUR)
     GROUP BY subTblSlides.BlockID;

Get Block Count PreviousCutoff

SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCount
FROM(
SELECT subTblSlides.BlockID AS subBlockID
FROM tblSlides as subTblSlides
INNER JOIN   tblSlideDistribution on subTblSlides.SlideDistributionID = tblSlideDistribution.SlideDistributionID
WHERE tblSlideDistribution.DTReadyForCourier > DATE_ADD(DATE_FORMAT(DATE(CASE WEEKDAY(CURRENT_DATE) 
     WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
     WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
     WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
     ELSE SUBDATE(CURRENT_DATE,1) 
     END), '%Y-%m-%d %T'), INTERVAL 18 HOUR)
     GROUP BY subTblSlides.BlockID) as qrySubBlocksCorrespondingToPendingSlides
     ;