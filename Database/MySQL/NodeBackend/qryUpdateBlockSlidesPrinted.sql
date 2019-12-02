/*qryUpdateBlockSlidesPrinted*/
UPDATE OPENLIS.tblBlock
SET
BlockStatus = 'Cut',
TimesSlidesPrintedAtMicrotomy = COALESCE(TimesSlidesPrintedAtMicrotomy, 0) + 5,
FirstSlidePrintedDT = IF( AnySlidesPrinted = 1, FirstSlidePrintedDT, NOW()),
LastSlidePrintedDT = IF( AnySlidesPrinted = 1, NOW(), LastSlidePrintedDT),
AnySlidesPrinted = 1,
Audit = CONCAT(COALESCE(Audit), ' ', NOW(), ' xxxx slide(s) printed off block by xxxx at xxxx.')
WHERE BlockID = 'HBLKMPS19-99999_B_1';