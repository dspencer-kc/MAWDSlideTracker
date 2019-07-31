SELECT qrySubBlocksPreviousDayWTimes.WhoPrinted, Count(qrySubBlocksPreviousDayWTimes.BlockID) AS CountOfBlockID
FROM (	SELECT tblSlides.WhoPrinted, tblSlides.BlockID, Max(tblSlides.DTPrinted) as DTBlockCut
        FROM tblSlides
        WHERE (((tblSlides.DTPrinted)>=('2019-07-11 22:00') And (tblSlides.DTPrinted)<'2019-07-14 22:00'))
        GROUP BY tblSlides.WhoPrinted, tblSlides.BlockID
        ORDER BY DTBlockCut) as qrySubBlocksPreviousDayWTimes
GROUP BY qrySubBlocksPreviousDayWTimes.WhoPrinted;