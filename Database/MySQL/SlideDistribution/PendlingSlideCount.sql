SELECT Count(SlideID) AS 'SlidesInTray'
FROM tblSlides
WHERE SlideDistributionID = {$slidedistrid};