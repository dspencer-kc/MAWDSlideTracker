SELECT qrySubBlocksPreviousDay.WhoPrinted, Count(qrySubBlocksPreviousDay.BlockID) AS CountOfBlockID
FROM (	SELECT tblSlides.WhoPrinted, tblSlides.BlockID
		FROM tblSlides
		WHERE (((tblSlides.DTPrinted)>=('2019-07-11 22:00') And (tblSlides.DTPrinted)<'2019-07-14 22:00'))
		GROUP BY tblSlides.WhoPrinted, tblSlides.BlockID) as qrySubBlocksPreviousDay
GROUP BY qrySubBlocksPreviousDay.WhoPrinted;