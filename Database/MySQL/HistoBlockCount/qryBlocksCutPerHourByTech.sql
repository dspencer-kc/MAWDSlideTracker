/*qrySlidesPerHourByTech*/
SET @StartDateTime = DATE_SUB(NOW(), INTERVAL 24 HOUR);
SET @EndDateTime = NOW();
SELECT user, EXTRACT(YEAR FROM ActionDateTime) as yearcut, EXTRACT(MONTH FROM ActionDateTime) as monthcut, EXTRACT(DAY FROM ActionDateTime) as daycut, h.Hour, 
  COALESCE( SUM(tblActionTracking.count), 0) AS Slides
  FROM ( SELECT 0 as hour
         UNION ALL SELECT 1
         UNION ALL SELECT 2
         UNION ALL SELECT 3
         UNION ALL SELECT 4
         UNION ALL SELECT 5
         UNION ALL SELECT 6
         UNION ALL SELECT 7
         UNION ALL SELECT 8
         UNION ALL SELECT 9
         UNION ALL SELECT 10
         UNION ALL SELECT 11
         UNION ALL SELECT 12
         UNION ALL SELECT 13
         UNION ALL SELECT 14
         UNION ALL SELECT 15
         UNION ALL SELECT 16
         UNION ALL SELECT 17
         UNION ALL SELECT 18
         UNION ALL SELECT 19
         UNION ALL SELECT 20
         UNION ALL SELECT 21
         UNION ALL SELECT 22
         UNION ALL SELECT 23) AS h
LEFT OUTER
  JOIN tblActionTracking
    ON EXTRACT(HOUR FROM ActionDateTime) = h.Hour
   AND ActionDateTime > @StartDateTime AND
   ActionDateTime <= @EndDateTime

GROUP
    BY yearcut, monthcut, daycut, h.Hour, user,  daycut, monthcut, yearcut
ORDER BY
	user, h.hour;

  /*qrySlidesPerHourByTech*/
SELECT user, EXTRACT(YEAR FROM ActionDateTime) as yearcut, EXTRACT(MONTH FROM ActionDateTime) as monthcut, EXTRACT(DAY FROM ActionDateTime) as daycut, h.Hour, 
  count(tblActionTracking.IDOfMaterial) AS Blocks
  FROM ( SELECT 0 as hour
         UNION ALL SELECT 1
         UNION ALL SELECT 2
         UNION ALL SELECT 3
         UNION ALL SELECT 4
         UNION ALL SELECT 5
         UNION ALL SELECT 6
         UNION ALL SELECT 7
         UNION ALL SELECT 8
         UNION ALL SELECT 9
         UNION ALL SELECT 10
         UNION ALL SELECT 11
         UNION ALL SELECT 12
         UNION ALL SELECT 13
         UNION ALL SELECT 14
         UNION ALL SELECT 15
         UNION ALL SELECT 16
         UNION ALL SELECT 17
         UNION ALL SELECT 18
         UNION ALL SELECT 19
         UNION ALL SELECT 20
         UNION ALL SELECT 21
         UNION ALL SELECT 22
         UNION ALL SELECT 23) AS h
LEFT OUTER
  JOIN tblActionTracking
    ON EXTRACT(HOUR FROM ActionDateTime) = h.Hour
   AND ActionDateTime > @StartDateTime AND
   ActionDateTime <= @EndDateTime

GROUP
    BY yearcut, monthcut, daycut, h.Hour, user,  daycut, monthcut, yearcut
ORDER BY
	user, h.hour;