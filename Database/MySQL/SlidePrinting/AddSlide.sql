/*qryGetNextSLAddedStainInst*/
SELECT MAX(staininst) as MaxStainInst  
FROM tblSlides
WHERE
  BlockID = '${strBlockID}' AND
staininst >= 100


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
`OrderingPath`,
`Department`,
`Patient`,
`SiteLabel`,
`StainLabel`,
`Printed`,
`DateTimePrinted`,
`LocationPrinted`,
`WhoPrinted`,
`TimesPrinted`,
`Note`,
`Specimen_id`,
`AccessionID`,
`ToBePrinted`,
`Audit`,
`TimesUpdatedFromCoPath`,
`LastTimeUpdatedFromCoPath`,
`SyncID`,
`LinkedEngravedCassette`,
`DTPrinted`,
`SlideStatusID`,
`SlideDistributionID`)
VALUES
(${strSlideID},
${strBlockID},
${strBlockStainInstID},
${strPartInst},
${intBlockInst},
((/*qryGetNextSLAddedStainInst*/
  SELECT MAX(staininst) as MaxStainInst  
  FROM tblSlides
  WHERE
    BlockID = '${strBlockID}' AND
  staininst >= 100) + 1),
1,
1,
<{Status: }>,
<{StainID: }>,
<{BlockDesignator: }>,
<{PartDesignator: }>,
<{StainOrderDate: }>,
<{OrderingPath: }>,
<{Department: }>,
<{Patient: }>,
<{SiteLabel: }>,
<{StainLabel: }>,
<{Printed: }>,
<{DateTimePrinted: }>,
<{LocationPrinted: }>,
<{WhoPrinted: }>,
<{TimesPrinted: 0}>,
<{Note: }>,
<{Specimen_id: }>,
<{AccessionID: }>,
<{ToBePrinted: 1}>,
<{Audit: }>,
<{TimesUpdatedFromCoPath: 1}>,
<{LastTimeUpdatedFromCoPath: }>,
<{SyncID: }>,
<{LinkedEngravedCassette: }>,
<{DTPrinted: }>,
<{SlideStatusID: $ord}>,
<{SlideDistributionID: }>);

/* qryUpdateSlideCountofSlidesOnSameBlock
   
*/