SELECT qrySubBlocksPreviousDay.subWhoPrinted, Count(qrySubBlocksPreviousDay.subBlockID) AS CountOfBlockID
FROM (SELECT subTblSlides.WhoPrinted AS subWhoPrinted, subTblSlides.BlockID AS subBlockID  
      FROM tblSlides as subTblSlides
      WHERE (((subTblSlides.DTPrinted)BETWEEN '2019-05-1' AND '2019-06-01'))
      GROUP BY subTblSlides.WhoPrinted, subTblSlides.BlockID) AS qrySubBlocksPreviousDay
GROUP BY qrySubBlocksPreviousDay.subWhoPrinted;