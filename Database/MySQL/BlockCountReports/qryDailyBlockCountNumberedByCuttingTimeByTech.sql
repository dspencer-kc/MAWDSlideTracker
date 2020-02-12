/*qryDailyBlockCountNumberedByCuttingTimeByTech*/
      SET @StartDateTime = '2020-02-04';
      SET @EndDateTime = '2020-02-05';
      SET @UserName = 'rkinsey';
      SET @rownum:=0;
      SELECT @rownum:=(@rownum+1) as BlockCutSeq, tblActionTracking.IDOfMaterial, MIN(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
      FROM tblActionTracking
      WHERE tblActionTracking.Action="SlidesPrintedOffBlock" AND
      tblActionTracking.user like @UserName AND
      tblActionTracking.Count>0 AND
      ActionDateTime >= @StartDateTime AND 
      ActionDateTime < @EndDateTime
      GROUP BY tblActionTracking.IDOfMaterial
      ORDER BY FirstOfActionDateTime;
      /*qryDailyBlockCountNumberedBySlideDistrTime*/
      SET @rownum:=0