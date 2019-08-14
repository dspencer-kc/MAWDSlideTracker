/*Total Block Count: Previous Busines Day Plus 18 Hours*/
SELECT DATE_ADD(DATE_FORMAT(DATE(
          CASE WEEKDAY(CURRENT_DATE) 
            WHEN 0 THEN SUBDATE(CURRENT_DATE,3)
            WHEN 6 THEN SUBDATE(CURRENT_DATE,2) 
            WHEN 5 THEN SUBDATE(CURRENT_DATE,1)
            ELSE SUBDATE(CURRENT_DATE,1) 
          END), '%Y-%m-%d %T'), INTERVAL 18 HOUR)

/* 1st Run 5 am to 8am
  2nd Run 8 am to 10 am
  3rd Run 10 am to 1:00 pm
  4th Run 1 pm and later */

/* qryTotalBlockCount
Total Block Count: Previous Busines Day Plus Hours set from tbleRunTime 'PreviousDayCutoff*/
SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
        FROM tblSlides as subTblSlides
        INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
        WHERE subTblSlideDistribution.DTReadyForCourier > funPreviousWorkDayCutoffDateTime()
        GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
GROUP BY SlideDistributionLocation

/* qryTotalBlockCountDetails*/
SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation, subTblSlideDistribution.DTReadyForCourier
        FROM tblSlides as subTblSlides
        INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
        WHERE subTblSlideDistribution.DTReadyForCourier > funPreviousWorkDayCutoffDateTime()
        GROUP BY subTblSlides.BlockID, SlideDistributionLocation, subTblSlideDistribution.DTReadyForCourier

/*qryFirstRunBlockCount*/
SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
        FROM tblSlides as subTblSlides
        INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
        WHERE subTblSlideDistribution.DTReadyForCourier >= funPreviousWorkDayCutoffDateTime()
         AND  subTblSlideDistribution.DTReadyForCourier < funCurrentDayFirstRunCutoff()
        GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
GROUP BY SlideDistributionLocation;

/*qrySecondRunBlockCount*/
SELECT Count(qrySubBlockCountWLocation.subBlockID) AS BlockCount, SlideDistributionLocation
FROM (SELECT subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation
        FROM tblSlides as subTblSlides
        INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
        WHERE subTblSlideDistribution.DTReadyForCourier >= funCurrentDayFirstRunCutoff()
         AND  subTblSlideDistribution.DTReadyForCourier < funCurrentDaySecondRunCutoff()
        GROUP BY subTblSlides.BlockID, SlideDistributionLocation) as qrySubBlockCountWLocation
GROUP BY SlideDistributionLocation;
