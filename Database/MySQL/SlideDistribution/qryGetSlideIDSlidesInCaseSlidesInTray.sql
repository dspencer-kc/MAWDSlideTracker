--Get Slide ID
SELECT SlideID 
      FROM tblSlides
      WHERE SlideDistributionID = 199;

--Get All Slides Count of Cases in Tray
SELECT AccessionID, Count(SlideID) as CaseSlidesInTray
      FROM tblSlides
      WHERE SlideDistributionID = 355
      Group By AccessionID, SlideCount;


--Need to join to count of all slides per case
SELECT AccessionID, Count(SlideID) as CaseSlidesTotal
      FROM tblSlides
      Group By AccessionID, SlideCount;


SELECT AccessionID, Count(SlideID) as CaseSlidesInTray
      FROM tblSlides
      WHERE SlideDistributionID = 355
      Group By AccessionID, SlideCount;


SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, qrySlideCountByCase.CaseSlidesTotal, [CaseSlidesTotal]-[CaseSlidesInTray] AS SlidesMissingFromTray
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=355))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase,
      (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesTotal
       FROM tblSlides
       GROUP BY tblSlides.AccessionID) as qrySlideCountByCase
INNER JOIN qrySlideCountInTrayByCase ON qrySlideCountByCase.AccessionID = qrySlideCountInTrayByCase.AccessionID;

SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, qrySlideCountByCase.CaseSlidesTotal, [CaseSlidesTotal]-[CaseSlidesInTray] AS SlidesMissingFromTray
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=355))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase,
      (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesTotal
       FROM tblSlides
       GROUP BY tblSlides.AccessionID) as qrySlideCountByCase
INNER JOIN qrySlideCountInTrayByCase ON qrySlideCountByCase.AccessionID = qrySlideCountInTrayByCase.AccessionID;

SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, vwSlideCountByCase.CaseSlidesTotal
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=355))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase
INNER JOIN 
   vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID;

