CREATE DEFINER=`root`@`%` FUNCTION `funPreviousWorkDayCutoffDateTime`() RETURNS datetime
BEGIN
RETURN (DATE_FORMAT(CAST((CASE WEEKDAY(CURDATE())
                        WHEN 0 THEN (CURDATE() - INTERVAL 3 DAY)
                        WHEN 6 THEN (CURDATE() - INTERVAL 2 DAY)
                        WHEN 5 THEN (CURDATE() - INTERVAL 1 DAY)
                        ELSE (CURDATE() - INTERVAL 1 DAY)
                    END)
                    AS DATE),
                '%Y-%m-%d %T') + INTERVAL (SELECT RunTimeCutoff FROM OPENLIS.tblRunTimes where RunName = 'PreviousDayCutoff') HOUR);
END