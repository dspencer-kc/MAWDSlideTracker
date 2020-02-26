/*qryUpdateCancelledBlocks*/
UPDATE OPENLIS.tblBlock
SET
Cancelled = 1
WHERE Specimen_id = 'mwd6554812' AND
PartInst = 1 AND
BlockInst = 11;

'/*qryUpdateCancelledBlocks*/ \
UPDATE OPENLIS.tblBlock \
SET \
Cancelled = 1 \
WHERE Specimen_id = ''' + strSpecimenID  + ''' AND \
PartInst = ' + strPartInst + ' AND \
BlockInst = ' + strBlockInst + ';' 