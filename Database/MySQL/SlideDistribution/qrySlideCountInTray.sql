/*qrySlideCountInTrayByTray*/
SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, vwSlideCountByCase.CaseSlidesTotal, (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) as CaseSlidesNotInTray
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=(SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001')))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase
INNER JOIN 
   vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID;


/*qryAccIDSlideCountInTrayBySlideDistrID*/
SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, vwSlideCountByCase.CaseSlidesTotal, (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) as CaseSlidesNotInTray
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=355))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase
INNER JOIN 
   vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID;

/*qryAccIDSlideCountInTrayBySlideDistrID*/
SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, vwSlideCountByCase.CaseSlidesTotal, (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) as CaseSlidesNotInTray
FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
      FROM tblSlides
      WHERE (((tblSlides.SlideDistributionID)=355))
      GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase
INNER JOIN 
   vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID;

SELECT Slides.SlideID, qrySubSlideCountsByAcc,CaseSlidesInTray, qrySubSlideCountsByAcc.CaseSlidesTotal, qrySubSlideCountsByAcc.CaseSlidesNotInTray
FROM tblSlides as Slides
INNER JOIN
  (SELECT qrySlideCountInTrayByCase.AccessionID, qrySlideCountInTrayByCase.CaseSlidesInTray, vwSlideCountByCase.CaseSlidesTotal, (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) as CaseSlidesNotInTray
  FROM (SELECT tblSlides.AccessionID, Count(tblSlides.SlideID) AS CaseSlidesInTray
          FROM tblSlides
          WHERE (((tblSlides.SlideDistributionID)=355))
          GROUP BY tblSlides.AccessionID, tblSlides.SlideCount) as qrySlideCountInTrayByCase
  INNER JOIN 
  vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID) as qrySubSlideCountsByAcc
        ON qrySubSlideCountsByAcc.AccessionID = tblSlides.AccessionID  

/*qrySlideCountInTrayBySlideDistr*/
SELECT 
    tblSlides.SlideID,
    qrySubSlideCountsByAcc.CaseSlidesInTray,
    qrySubSlideCountsByAcc.CaseSlidesTotal,
    qrySubSlideCountsByAcc.CaseSlidesNotInTray
FROM
    tblSlides
        INNER JOIN
    (SELECT 
        qrySlideCountInTrayByCase.AccessionID,
            qrySlideCountInTrayByCase.CaseSlidesInTray,
            vwSlideCountByCase.CaseSlidesTotal,
            (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) AS CaseSlidesNotInTray
    FROM
        (SELECT 
        tblSlides.AccessionID,
            COUNT(tblSlides.SlideID) AS CaseSlidesInTray
    FROM
        tblSlides
    WHERE
        (((tblSlides.SlideDistributionID) = 355))
    GROUP BY tblSlides.AccessionID , tblSlides.SlideCount) AS qrySlideCountInTrayByCase
    INNER JOIN vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID) AS qrySubSlideCountsByAcc ON qrySubSlideCountsByAcc.AccessionID = tblSlides.AccessionID
WHERE
    tblSlides.SlideDistributionID = 355;

/*qrySlideCountInTrayBySlideTray*/
SELECT 
    tblSlides.SlideID,
    qrySubSlideCountsByAcc.CaseSlidesInTray,
    qrySubSlideCountsByAcc.CaseSlidesTotal,
    qrySubSlideCountsByAcc.CaseSlidesNotInTray
FROM
    tblSlides
        INNER JOIN
    (SELECT 
        qrySlideCountInTrayByCase.AccessionID,
            qrySlideCountInTrayByCase.CaseSlidesInTray,
            vwSlideCountByCase.CaseSlidesTotal,
            (vwSlideCountByCase.CaseSlidesTotal - qrySlideCountInTrayByCase.CaseSlidesInTray) AS CaseSlidesNotInTray
    FROM
        (SELECT 
        tblSlides.AccessionID,
            COUNT(tblSlides.SlideID) AS CaseSlidesInTray
    FROM
        tblSlides
    WHERE
        (((tblSlides.SlideDistributionID) = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001')))
    GROUP BY tblSlides.AccessionID , tblSlides.SlideCount) AS qrySlideCountInTrayByCase
    INNER JOIN vwSlideCountByCase ON qrySlideCountInTrayByCase.AccessionID = vwSlideCountByCase.AccessionID) AS qrySubSlideCountsByAcc ON qrySubSlideCountsByAcc.AccessionID = tblSlides.AccessionID
WHERE
    tblSlides.SlideDistributionID = (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001');