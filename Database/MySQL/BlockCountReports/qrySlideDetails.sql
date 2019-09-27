/*qrySlideDetails*/
SELECT DTReadyForCourier, SlideID, StainLabel, SlideTray
  FROM tblSlides as subTblSlides
  INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
  WHERE subTblSlideDistribution.DTReadyForCourier >= funPreviousWorkDayCutoffDateTime() AND
    subTblSlideDistribution.DTReadyForCourier < funCurrentDayFirstRunCutoff() AND
    SlideDistributionLocation = 'LOCNLIB'
    Order By DTReadyForCourier desc;