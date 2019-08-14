CREATE DEFINER=`root`@`%` FUNCTION `funCurrentDayFirstRunCutoff`() RETURNS datetime
BEGIN
RETURN (DATE_FORMAT(CAST(CURDATE()
                    AS DATE),
                '%Y-%m-%d %T') + INTERVAL (SELECT RunTimeCutoff FROM OPENLIS.tblRunTimes where RunName = '1st Run') HOUR);
END