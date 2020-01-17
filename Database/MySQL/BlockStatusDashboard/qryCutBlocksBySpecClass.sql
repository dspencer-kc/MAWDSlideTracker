/*qryEstimatedBlocksBySpecClass.sql
For this to work, we need to utilize tblBlock.Cancelled and tblBlock.HoldOver, and also add same day blocks
Engrave Time should be from 8:00 pm two previous day to 8:00 pm previous day.
If marked hold over, it should be 3 previous day to 2 previous day.
If cancelled, do not include.
*/

SET @varBlockDTEngravedGreaterThan = '2020-01-14 22:00';
SET @varBlockDTEngravedLessThanEqualTo = '2020-01-15 23:00';
SET @varHoldOverBlockDTEngravedGreaterThan = '2020-01-13 22:00';
SET @varHoldOverBlockDTEngravedLessEgualToThan = '2020-01-14 22:00';

SELECT LEFT(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1),length(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1))-2) as SpecPrefix, 
  COUNT(BlockID) as 'BlockCount',
  SUM(AnySlidesPrinted) as 'BlocksCut',
  COUNT(BlockID) - SUM(AnySlidesPrinted) as 'Blocks_Left_To_Cut',
  SUM(AnySlidesPrinted) / COUNT(BlockID) as '%_Blocks_Cut'
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
ORDER BY BlockCount DESC;

/*qryEstimatedBlocksTotal.sql
For this to work, we need to utilize tblBlock.Cancelled and tblBlock.HoldOver, and also add same day blocks
Engrave Time should be from 8:00 pm two previous day to 8:00 pm previous day.
If marked hold over, it should be 3 previous day to 2 previous day.
If cancelled, do not include.
*/

SELECT COUNT(BlockID) as 'BlockCount',
  SUM(AnySlidesPrinted) as 'BlocksCut',
  COUNT(BlockID) - SUM(AnySlidesPrinted) as 'Blocks_Left_To_Cut',
  SUM(AnySlidesPrinted) / COUNT(BlockID) as '%_Blocks_Cut'
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
);

/*qryBlocksLeftDetails.sql
For this to work, we need to utilize tblBlock.Cancelled and tblBlock.HoldOver, and also add same day blocks
Engrave Time should be from 8:00 pm two previous day to 8:00 pm previous day.
If marked hold over, it should be 3 previous day to 2 previous day.
If cancelled, do not include.
*/

SELECT BlockID, BlockStatus, EmbeddedDT, DateTimeEngraved, BlockComment, HoldOver
FROM OPENLIS.tblBlock where
(tblBlock.Cancelled is null OR tblBlock.Cancelled = 0) AND
  (AnySlidesPrinted = 0 OR
  AnySlidesPrinted is null) AND
  (
      ((tblBlock.Holdover is null OR tblBlock.Holdover = 0) AND
    DateTimeEngraved > @varBlockDTEngravedGreaterThan AND DateTimeEngraved <= @varBlockDTEngravedLessThanEqualTo) 
    OR
    (
    tblBlock.Holdover = 1 AND
    DateTimeEngraved > @varHoldOverBlockDTEngravedGreaterThan AND DateTimeEngraved <= @varHoldOverBlockDTEngravedLessEgualToThan
    )
  )
  ORDER BY EmbeddedDT, DateTimeEngraved;
