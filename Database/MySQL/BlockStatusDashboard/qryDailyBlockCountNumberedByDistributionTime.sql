/*qryDailyBlockCountNumberedBySlideDistrTime*/
SET @rownum:=0;
SELECT @rownum:=(@rownum+1) as BlockDistSeq, subTblSlides.BlockID AS subBlockID, subTblSlideDistribution.SlideDistributionLocation, MIN(subTblSlideDistribution.DTReadyForCourier) as FirstDTReadyForCourier
        FROM tblSlides as subTblSlides
        INNER JOIN   tblSlideDistribution as subTblSlideDistribution on subTblSlides.SlideDistributionID = subTblSlideDistribution.SlideDistributionID
        WHERE subTblSlideDistribution.DTReadyForCourier >= funPreviousWorkDayCutoffDateTime()
group by subTblSlides.BlockID, subTblSlideDistribution.SlideDistributionLocation
order by FirstDTReadyForCourier, BlockDistSeq