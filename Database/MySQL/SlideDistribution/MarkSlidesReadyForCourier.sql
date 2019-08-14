UPDATE OPENLIS.tblSlideDistribution
SET
Status = 'Ready For Courier',
WhoMarkedReadyForCourier = '<{WhoMarkedReadyForCourier: }>',
DTReadyForCourier = NOW(),
SlideDistributionLocation = '<{SlideDistributionLocation: }>',
Audit = CONCAT(Audit, 'Assigned location, marked ready for courier:',NOW(), '.'),
StationLocationScanned = '<{StationLocationScanned: }>',
WhoSetLocation = '<{WhoSetLocation: }'>
WHERE SlideDistributionID = <{expr}>;
UPDATE OPENLIS.tblSlides
SET
SlideStatusID = '$rfc'
WHERE SlideDistributionID = <{expr}>;
