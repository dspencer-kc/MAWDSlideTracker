var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')

module.exports = {

  updatelocationstatusandcomments: updatelocationstatusandcomments,
  insertpathcomments: insertpathcomments
}

function updatelocationstatusandcomments (request, response, callback) {

  // console.log('start updatelocationstatusandcomments')
  let strAPISecret = null
  let strLocationID = null
  let strUserId = null
  let strStation = null
  let strUnsanitizedSQL = null
  let arSQLInserts = null
  let strSanitizedSQL = null

  strAPISecret = 'disabled'

  if (strAPISecret === 'disabled') {
    strStation = request.body.WORKSTATION
    strUserId = request.body.USER
    strLocationID = request.body.LOCNID
    // console.log(strStrAccessionID)

    strUnsanitizedSQL = `/*qrySetSlideDistrLocStatus.sql
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
    ?);`

    // Sanitized Params
    arSQLInserts = [strLocationID, strLocationID, strUserId, strStation]
    strSanitizedSQL = mysql.format(strUnsanitizedSQL, arSQLInserts)
    // console.log(strSanitizedSQL)
    if (strSanitizedSQL !== null) {
      // Connect to the database
      var con = mysql.createConnection(mysqlConfig)
      con.query(strSanitizedSQL, function (err, result) {
        if (err) {
          response.send(err)
          console.log(err)
        // On Error, close connection
        } else {
        // if there is no error, you have the result
          response.send(result)
        }
        con.end()
      })
    }
  } else {
    response.send('Unknown Error')
  }
}

function insertpathcomments (request, response, callback) {

  // console.log('start updatelocationstatusandcomments')
  let strAPISecret = null
  let strLocationID = null
  let strUserId = null
  let strStation = null
  let strUnsanitizedSQL = null
  let arSQLInserts = null
  let strSanitizedSQL = null
  let strComment = null
  let strCommentType = null

  //  Disabled - Internal access only to API
  strAPISecret = 'disabled'

  if (strAPISecret === 'disabled') {
    strStation = request.body.WORKSTATION
    strUserId = request.body.USER
    strLocationID = request.body.LOCNID
    strComment = request.body.COMMENT
    strCommentType = request.body.COMMENTTYPE
    // console.log(strStrAccessionID)

    strUnsanitizedSQL = `/*qryInsertPathConsoleComments
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
  ?);`

    // Sanitized Params
    arSQLInserts = [strLocationID, strCommentType, strComment, strUserId, strStation]
    strSanitizedSQL = mysql.format(strUnsanitizedSQL, arSQLInserts)
    // console.log(strSanitizedSQL)
    if (strSanitizedSQL !== null) {
      // Connect to the database
      var con = mysql.createConnection(mysqlConfig)
      con.query(strSanitizedSQL, function (err, result) {
        if (err) {
          response.send(err)
          console.log(err)
        // On Error, close connection
        } else {
        // if there is no error, you have the result
          response.send(result)
        }
        con.end()
      })
    }
  } else {
    response.send('Unknown Error')
  }
}
