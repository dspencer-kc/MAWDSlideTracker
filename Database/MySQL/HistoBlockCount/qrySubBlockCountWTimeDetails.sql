SELECT tblSlides.WhoPrinted, tblSlides.BlockID, Max(tblSlides.DTPrinted) as DTBlockCut, day(tblSlides.DTPrinted) as DayBlockCut, year(tblSlides.DTPrinted) as YearBlockCut, SEC_TO_TIME(FLOOR((TIME_TO_SEC(tblSlides.DTPrinted)+450)/900)*900) as 'RoundedTo15MinutesBlockCut'
        FROM tblSlides
        WHERE (((tblSlides.DTPrinted)>=('2019-07-11 22:00') And (tblSlides.DTPrinted)<'2019-07-14 22:00'))
        GROUP BY tblSlides.WhoPrinted, tblSlides.BlockID, day(tblSlides.DTPrinted), year(tblSlides.DTPrinted), SEC_TO_TIME(FLOOR((TIME_TO_SEC(tblSlides.DTPrinted)+450)/900)*900)
        ORDER BY DTBlockCut