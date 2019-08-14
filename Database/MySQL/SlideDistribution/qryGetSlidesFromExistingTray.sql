      SELECT SlideID 
      FROM tblSlides
      WHERE SlideDistributionID = '199';
      SELECT Count(SlideID) AS 'SlidesInTray'
      FROM tblSlides
      WHERE SlideDistributionID = '199';
      SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
      FROM (SELECT subTblSlides.BlockID AS subBlockID  
            FROM tblSlides as subTblSlides
            WHERE subTblSlides.SlideDistributionID = '199'
            GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
      ;

      SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001'

      SELECT max(subTblSlideDistribution.SlideDistributionID) as CurrentSlideDistID 
                              FROM tblSlideDistribution as subTblSlideDistribution
                              WHERE SlideTray = '${strSlideTrayIDExistingST}';
      SELECT SlideID 
      FROM tblSlides
      WHERE SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001');
      SELECT Count(SlideID) AS 'SlidesInTray'
      FROM tblSlides
      WHERE SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001');
      SELECT Count(qrySubBlocksCorrespondingToPendingSlides.subBlockID) AS BlockCountInTray
      FROM (SELECT subTblSlides.BlockID AS subBlockID  
            FROM tblSlides as subTblSlides
            WHERE subTblSlides.SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001')
            GROUP BY subTblSlides.BlockID) AS qrySubBlocksCorrespondingToPendingSlides
      ;