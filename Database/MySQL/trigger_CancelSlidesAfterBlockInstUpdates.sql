CREATE TRIGGER CancelSlidesAfterBlockInstUpdates BEFORE UPDATE ON tblBlock
FOR EACH ROW
BEGIN
  UPDATE tblSlides
  SET Status = 'Canceled',
  ToBePrinted = 0,
  `Audit` = CONCAT(`Audit`, ' #',NOW(), ' ', "Slide cancelled, block was deleted and then overwritten by: ", NEW.WhoEngraved, " at ", NEW.WorkstationID," new Block Instance is ", NEW.BlockInst,".")
  WHERE  BlockID = NEW.BlockID AND BlockInst <> NEW.BlockInst;
END
