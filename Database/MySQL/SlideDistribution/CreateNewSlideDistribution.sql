INSERT INTO `OPENLIS`.`tblSlideDistribution`
(`SlideTray`,
`Status`,
`WhoMarkedReadyForCourier`,
`DTReadyForCourier`,
`SlideDistributionLocation`,
`StationSlideTrayScanned`,
`Audit`)
VALUES
('SLTRMWD001',
'PendingLocation',
'Username',
NOW(),
'Pending',
'Scan Location',
concat('Initial insert:', now(), ' ')
);
SELECT last_insert_id();