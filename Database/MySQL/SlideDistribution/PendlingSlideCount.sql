SELECT Count(SlideID) AS 'SlidesInTray'
FROM tblSlides
WHERE SlideStatusID = '$itpl';