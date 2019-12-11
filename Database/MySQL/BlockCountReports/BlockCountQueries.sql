
SELECT ActionTrackingID FROM OPENLIS.tblActionTracking Where ActionDateTime >= `OPENLIS`.`funPreviousWorkDayCutoffDateTime`() order by ActionTrackingID ASC LIMIT 1 


/* See info here on this query
https://mysqlserverteam.com/row-numbering-ranking-how-to-use-less-user-variables-in-mysql-queries/ */


SELECT ActionTrackingID, ActionDateTime FROM OPENLIS.tblActionTracking Where ActionDateTime >= `OPENLIS`.`funPreviousWorkDayCutoffDateTime`()

SELECT tblActionTracking.IDOfMaterial, First(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
FROM tblActionTracking
WHERE (((tblActionTracking.Action)="SlidesPrintedOffBlock") AND ((tblActionTracking.Count)>0))
GROUP BY tblActionTracking.IDOfMaterial
HAVING (((First(tblActionTracking.ActionDateTime))>= `funPreviousWorkDayCutoffDateTime`()))
ORDER BY First(tblActionTracking.ActionDateTime);


SELECT tblActionTracking.IDOfMaterial, MIN(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
FROM tblActionTracking
WHERE tblActionTracking.Action="SlidesPrintedOffBlock" AND
tblActionTracking.Count>0
GROUP BY tblActionTracking.IDOfMaterial

SELECT tblActionTracking.IDOfMaterial, MIN(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
FROM tblActionTracking
WHERE tblActionTracking.Action="SlidesPrintedOffBlock" AND
tblActionTracking.Count>0 AND
ActionDateTime >= funPreviousWorkDayCutoffDateTime()
GROUP BY tblActionTracking.IDOfMaterial
ORDER BY FirstOfActionDateTime

/*qryDailyBlockCountNumberedByCuttingTime*/
SET @rownum:=0;
SELECT @rownum:=(@rownum+1) as BlockCutSeq, tblActionTracking.IDOfMaterial, MIN(tblActionTracking.ActionDateTime) AS FirstOfActionDateTime
FROM tblActionTracking
WHERE tblActionTracking.Action="SlidesPrintedOffBlock" AND
tblActionTracking.Count>0 AND
ActionDateTime >= funPreviousWorkDayCutoffDateTime()
GROUP BY tblActionTracking.IDOfMaterial
ORDER BY FirstOfActionDateTime
