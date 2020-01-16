/*qryCutBlocksBySpecClass.sql
For this to work, we need to utilize tblBlock.Cancelled and tblBlock.HoldOver, and also add same day blocks
Engrave Time should be from 8:00 pm two previous day to 8:00 pm previous day.
If marked hold over, it should be 3 previous day to 2 previous day.
If cancelled, do not include.
*/
SET @varBlockDTGreaterThan = '2019-12-12 22:00';
SET @varBlockDTLessThanEqualTo = '2019-12-13 22:00';
SET @varHoldOverBlockDTGreaterThan = '2019-12-11 22:00';
SET @varHoldOverBlockDTLessEgualToThan = '2019-12-12 22:00';

SELECT LEFT(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1),length(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1))-2) as SpecPrefix, 
  COUNT(BlockID) as 'BlocksCut'
FROM OPENLIS.tblBlock where
(tblBlock.Cancelled is null OR tblBlock.Cancelled = 0) AND
(
    ((tblBlock.Holdover is null OR tblBlock.Holdover = 0) AND
  FirstSlidePrintedDT > @varBlockDTGreaterThan AND FirstSlidePrintedDT <= @varBlockDTLessThanEqualTo) 
  OR
  (
   tblBlock.Holdover = 1 AND
   FirstSlidePrintedDT > @varHoldOverBlockDTGreaterThan AND FirstSlidePrintedDT <= @varHoldOverBlockDTLessEgualToThan
  )
)
GROUP BY SpecPrefix
ORDER BY BlocksCut DESC