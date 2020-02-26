SELECT p_block.block_inst, p_block.pieces_num, p_block.wkdept_id, p_block.sequence, p_block.requestclass_id, p_block.log_comment, p_block.who_engr_queued,  p_block.blkstatus_id  
FROM p_block 
WHERE (p_block.specimen_id='mwd1741802') AND (p_block.part_inst='2') AND (p_block.blkdesig_label='1');