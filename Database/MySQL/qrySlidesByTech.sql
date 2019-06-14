SELECT tblSlides.WhoPrinted, Count(tblSlides.SlideID) AS CountOfSlideID
FROM tblSlides
WHERE (((tblSlides.DTPrinted) BETWEEN '2019-05-1' AND '2019-06-01'))
GROUP BY tblSlides.WhoPrinted;
