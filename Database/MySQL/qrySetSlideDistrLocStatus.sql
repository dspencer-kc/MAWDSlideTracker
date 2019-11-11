/*qrySetSlideDistrLocStatus.sql
  Update status and insert comment.
  Params: [strLocationID, strLocationID, strUserId, strStation]
*/
UPDATE OPENLIS.tblSlideDistributionLocations
SET
Status = 'CLOSED'
WHERE LocationID = ?;
INSERT INTO OPENLIS.tblPathConsoleComments
(
SlideDistrLocationID,
CommentType,
Comment,
CommentDateTime,
Author,
Station)
VALUES
(?,
'SLIDEDISTRIBUTION',
'Location marked closed.  No new surgical cases to be assigned today.',
NOW(),
?,
?);
