/*qryGetCancelledBlocks*/
SELECT TOP 1000 specimen_id, part_Inst, Block_Inst
FROM p_block
where
status_date > '2020-02-12' AND 
Blkstatus_id = '$can'
 ORDER BY status_date

/*qryGetHoldOverBlocks*/
SELECT TOP 1000 specimen_id, part_Inst, Block_Inst
FROM p_block
where
status_date > '2020-02-12' AND 
Blkstatus_id = '$can'
 ORDER BY status_date