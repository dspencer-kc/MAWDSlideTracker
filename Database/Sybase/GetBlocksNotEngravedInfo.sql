SELECT 
  c_specimen.specnum_formatted, 
  r_pat_demograph.lastname, 
  r_pat_demograph.firstname, 
  r_pat_demograph.middlename, 
  c_specimen.specnum_year, 
  c_specimen.specnum_num, 
  p_part.parttype_id, 
  p_part.part_description, 
  p_part.datetime_taken, 
  p_part.datetime_rec, 
  p_part.protocol_id, 
  p_part.sequence as partsequence, 
  p_part.comment, 
  p_part.part_designator, 
  p_block.pieces_num, 
  p_block.wkdept_id, 
  p_block.requestclass_id, 
  p_block.log_comment, 
  p_block.blkdesig_label, 
  p_block.specimen_id, 
  p_block.part_inst, 
  p_block.block_inst,
  p_block.sequence as blocksequence 
FROM 
  (
    (
      p_part 
      RIGHT JOIN c_specimen ON p_part.specimen_id = c_specimen.specimen_id
    ) 
    LEFT JOIN p_block ON (
      p_part.part_inst = p_block.part_inst
    ) 
    AND (
      p_part.specimen_id = p_block.specimen_id
    )
  ) 
  LEFT JOIN r_pat_demograph ON c_specimen.patdemog_id = r_pat_demograph.patdemog_id 
WHERE 
  (
    (
      (p_block.specimen_id)= "mwd1741802"
    ) 
    AND (
      (p_block.part_inst)= "1"
    ) 
    AND (
      (p_block.block_inst)= "4"
    )
  );