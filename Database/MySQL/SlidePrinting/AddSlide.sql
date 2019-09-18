/*Query 1 - get StainLabel by ID
  Query 2 - qryGetNextSLAddedStainInst
  Query 3 - Get stain details from other slides on block
 */
SELECT abbr  as StainLabel FROM OPENLIS.copath_c_d_stainprocess where id = '$hinit';
/*qryGetNextSLAddedStainInst
 - To avoid stain instance conflicts with CoPath, any slides added from the SlideTracker not in CoPath will have a stain instance of 100 and incrementing from there*/
SELECT coalesce(MAX(staininst),99) + 1 as 'NextStainInstAbove100'
FROM tblSlides
WHERE
  BlockID = '${strBlockID}' AND
staininst >= 100;
SELECT 
  max(PartInst) as PartInst,
  max(BlockInst) as BlockInst,
  max(BlockDesignator) as BlockDesignator, 
  max(PartDesignator) as PartDesignator, 
  max(Patient) as Patient,
  max(SiteLabel) as SiteLabel,
  max(Specimen_id) as Specimen_id,
  max(AccessionID) as AccessionID
FROM
  tblSlides
WHERE
  BlockID = 'HBLKMPS19-99999_A_9'
GROUP BY
  PartInst,
  BlockInst,
  BlockDesignator,
  PartDesignator,
  Patient,
  SiteLabel,
  Specimen_id,
  AccessionID


/*Get Details to add stain
    Parameters:

    BlockID,
    PartInst,
    BlockInst,
    BlockDesignator,
    PartDesignator,
    Patient,
    SiteLabel,
    Specimen_id,
    AccessionID,
    SlideInst (looped in API for more than 1)


   Returns: 
   Stain Inst
     - Stains Added outside of CoPath will get a staininst starting at 100, so return next staininst starting at 100
   BlockStainInstID
    -  Block ID Plus stain inst
   PartInst,
   BlockInst,
   StainInst (see above),
   SlideInst,
   Slide Count,
   StainID
     */


/* qryAddSlide */
INSERT INTO `OPENLIS`.`tblSlides`
(`SlideID`, /*Block Stain Inst ID Plus Slide Inst*/
`BlockID`,
`BlockStainInstID`, /*Block ID Plus stain inst*/
`PartInst`,
`BlockInst`,
`StainInst`,
`SlideInst`,
`SlideCount`,
`Status`,
`StainID`,
`BlockDesignator`,
`PartDesignator`,
`StainOrderDate`,
`Patient`,
`SiteLabel`,
`StainLabel`,
`TimesPrinted`,
`Specimen_id`,
`AccessionID`,
`ToBePrinted`,
`Audit`,
`SyncID`,
`SlideStatusID`)
VALUES
(${strSlideID}, /* SlideID */
${strBlockID}, /* BlockID */
${strBlockStainInstID}, /*strBlockStainInstID*/
${strPartInst}, /*strPartInst*/
${intBlockInst}, /*intBlockInst*/
${strStainInst}, /*StainInst*/
${SlideInst}, /*SlideInst*/
${SlideCount}, /*SlideCount*/
${Status}, /*Status*/
${StainID}, /*StainID*/
${BlockDesignator}, /*BlockDesignator*/
${PartDesignator}, /*PartDesignator*/
${StainOrderDate}, /*Status*/
${strPatient}, /*Patient*/
${strSiteLabel}, /*SiteLabel*/
${strStainLabel}, /*StainLabel*/
0, /*TimesPrinted*/
${Specimen_id}, /*Specimen_id*/
${strAccessionID}, /*AccessionID*/
1, /*ToBePrinted*/
${strAudit}, /*Audit*/
0, /*SyncID*/
'$add' /*SlideStatusID*/
);
