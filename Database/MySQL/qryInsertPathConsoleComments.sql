/*qryInsertPathConsoleComments
  Params: [strLocationID, strCommentType, strComment, strUserId, strStation]
  Extra escaping for comment field????
*/
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
?,
?,
NOW(),
?,
?);