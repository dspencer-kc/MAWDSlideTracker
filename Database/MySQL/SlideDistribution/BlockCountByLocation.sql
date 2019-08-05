SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
FROM tblSlides as subTblSlides
INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
WHERE subTblSlideDistribution.DTReadyForCourier > DATE_ADD(DATE_FORMAT(DATE(CASE WEEKDAY(CURRENT_DATE) 
     WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
     WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
     WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
     ELSE SUBDATE(CURRENT_DATE,1) 
     END), '%Y-%m-%d %T'), INTERVAL 18 HOUR)
     GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
GROUP BY SlideDistributionLocation