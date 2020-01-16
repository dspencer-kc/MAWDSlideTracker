/*qryDailyBlockCountNumberedByCuttingTime*/
      SET @rownum:=0;
      SELECT @rownum:=(@rownum+1) as BlockCutSeq, tblActionTracking.IDOfMaterial, MIN(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
      FROM tblActionTracking
      WHERE tblActionTracking.Action="SlidesPrintedOffBlock" AND
      tblActionTracking.Count>0 AND
      ActionDateTime >= funPreviousWorkDayCutoffDateTime()
      GROUP BY tblActionTracking.IDOfMaterial
      ORDER BY FirstOfActionDateTime