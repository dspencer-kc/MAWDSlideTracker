/*qryEstimatedBlockCount.sql*/
SET @varBlockDTEngravedGreaterThan = '2019-12-16 22:00';
SET @varBlockDTEngravedLessThanEqualTo = '2019-12-17 22:00';
SET @varHoldOverBlockDTEngravedGreaterThan = '2019-12-15 22:00';
SET @varHoldOverBlockDTEngravedLessEgualToThan = '2019-12-16 22:00';

SELECT COUNT(BlockID) as 'EstimatedBlocks'
FROM OPENLIS.tblBlock where
(tblBlock.Cancelled is null OR tblBlock.Cancelled = 0) AND
(
    ((tblBlock.Holdover is null OR tblBlock.Holdover = 0) AND
  DateTimeEngraved > @varBlockDTEngravedGreaterThan AND DateTimeEngraved <= @varBlockDTEngravedLessThanEqualTo) 
  OR
  (
   tblBlock.Holdover = 1 AND
   DateTimeEngraved > @varHoldOverBlockDTEngravedGreaterThan AND DateTimeEngraved <= @varHoldOverBlockDTEngravedLessEgualToThan
  )
)