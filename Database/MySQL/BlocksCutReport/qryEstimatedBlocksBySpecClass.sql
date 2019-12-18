/*qryEstimatedBlocksBySpecClass.sql*/
SET @varBlockDTEngravedGreaterThan = '2019-12-12 22:00';
SET @varBlockDTEngravedLessThanEqualTo = '2019-12-13 22:00';
SET @varHoldOverBlockDTEngravedGreaterThan = '2019-12-11 22:00';
SET @varHoldOverBlockDTEngravedLessEgualToThan = '2019-12-12 22:00';

SELECT LEFT(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1),length(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1))-2) as SpecPrefix, 
  COUNT(BlockID) as 'EstimatedBlocks'
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
GROUP BY SpecPrefix
ORDER BY EstimatedBlocks DESC