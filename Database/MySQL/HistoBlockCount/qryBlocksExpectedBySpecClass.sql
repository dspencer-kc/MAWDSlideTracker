SELECT LEFT(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1),length(LEFT(TRIM('HBLK' FROM BLOCKID),INSTR(TRIM('HBLK' FROM BLOCKID),"-")-1))-2) as SpecPrefix, 
  BlockID  
FROM OPENLIS.tblBlock where
  DateTimeEngraved >= funPreviousWorkDayCutoffDateTime();

