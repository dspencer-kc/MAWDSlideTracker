SELECT tblSlides.WhoPrinted, count(tblSlides.BlockID) as BlocksCut, concat(month(tblSlides.DTPrinted),'.',day(tblSlides.DTPrinted),'.', year(tblSlides.DTPrinted),' ', SEC_TO_TIME(FLOOR((TIME_TO_SEC(tblSlides.DTPrinted)+450)/900)*900)) as DTBlockCutRounded15
        FROM tblSlides
        WHERE (((tblSlides.DTPrinted)>=('2019-07-11 22:00') And (tblSlides.DTPrinted)<'2019-07-14 22:00'))
        GROUP BY tblSlides.WhoPrinted, DTBlockCutRounded15
        ORDER BY Max(tblSlides.DTPrinted)