UPDATE OPENLIS.tblSlideDistribution as tblUpdate
Inner Join (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = 'SLTRMWD001') as tblB ON tblUpdate.SlideDistributionID = tblB.SlideDistID
SET
tblUpdate.SlideDistributionLocation = 'LOCNDAH',
tblUpdate.Audit = CONCAT(tblUpdate.Audit, 'Assigned location:',NOW(), '.'),
tblUpdate.StationLocationScanned = 'DrewTEST',
tblUpdate.WhoSetLocation = 'Drew'
WHERE tblUpdate.SlideDistributionID = SlideDistID;

`UPDATE OPENLIS.tblSlideDistribution as tblUpdate
Inner Join (SELECT max(subTblSlideDistribution.SlideDistributionID) as SlideDistID FROM tblSlideDistribution as subTblSlideDistribution where SlideTray = '${strSlideTrayIDForST}') as tblB ON tblUpdate.SlideDistributionID = tblB.SlideDistID
SET
tblUpdate.SlideDistributionLocation = '${strSlideDistrLocIDForST}',
tblUpdate.Audit = CONCAT(tblUpdate.Audit, 'Assigned location:',NOW(), '.'),
tblUpdate.StationLocationScanned = '${strScanLocationForST}',
tblUpdate.WhoSetLocation = '${strUserTrayNewLoc}'
WHERE tblUpdate.SlideDistributionID = SlideDistID;`