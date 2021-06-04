const strROBOTRequestURL = 'https://nervous-donkey-89.loca.lt'
// old http://nervous-bear-74.loca.lt/retrieve_slide/
const fetch = require("node-fetch");
var mysql = require('mysql')
var mysqlConfig = require('../mysqlConfig')
const url = require('url')
var dateFormat = require('dateformat')
var fs = require('fs')
var intDebugLvel = 1

module.exports = {
  querySlideLocation: querySlideLocation,
  pullSlidesWithStorageDetails: pullSlidesWithStorageDetails,
  requestSlide: requestSlide
}

function querySlideLocation (request, response, callback) {
//= ==========================================================================================
//
//    Function xxx
//      xxx
//
//    Author: Drew Spencer
//
//
//    When to call:
//      xxx
//= ===========================================================================================
  var strUserID = request.body.slideid

  var strSQL = `SELECT * FROM OPENLIS.tblslidestorage
            WHERE \`slide_id\` = '` + slideid + `';`

console.log(strSQL)

// Connect to the database
var con = mysql.createConnection(mysqlConfig)
console.log('Connected!')

con.query(strSQL, function (err, result) {
    if (err) {
    console.log(err)
    } else {
    console.log('Completed query.')
    console.log(result)
    response.json(result)
    }
    con.end()
}) // End query
}

function requestSlide (request, response, callback) {
  const strSlideID = request.body.slideID
  const strGetURL = strROBOTRequestURL + '/retrieve_slide/' + strSlideID + '/'
  console.log('Hello request slide')
  console.log('Slide ID' + strSlideID)
  console.log(strGetURL)
  fetch(strGetURL, {
    method: "GET",
    headers: {
    }
  })
    // .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log('hello from request slide')
      // Insert respone here?
    })
}

function pullSlidesWithStorageDetails (request, response, callback) {
  console.log('Start Pull Slides with Storage Details')
//= ==========================================================================================
//
//    app.get slidetracker
//
//    Used to lookup slides by BlockID
//
//    Author: Drew Spencer
//
//    Last edited: 12/21/2018 ds
//
//    When to call:
//      After tech scans blockID
//
//    Purpose:
//      Pulls all pending slides for block
//
//    Paremeters:  **Paremeters are in URL through get
//        strBLockID:  id of block to print Slides
//
//    Returns:    JSON with all slide information
//
//= ===========================================================================================
  let urlParts = url.parse(request.url, true)
  let strAccessionID = request.body.accessionid
  /*
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => console.log(json))
  */ 

  try {
    console.log('start fetch')
    fetch("http://localhost:8080/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-hasura-admin-secret": "myadminsecretkey"
      },
      body: JSON.stringify({
        query: `query qryGetSlideDetails {
          slides(where: {accessionid: {_eq: "${strAccessionID}"}}) {
            accessionid
            blockid
            box_id
            casetype
            location
            requestts
            requestedby
            retrievalrequest
            sitelabel
            slideid
            stain
            stainorderdate
            ts
            year
          }
        }
        `
      })
    })

    console.log('fetch ended')
      .then(response => response.json())
      console.log('response sent start .then')
      .then(data => {
        console.log('second .then')
        console.log(data)
        console.log('next call insert slide storage details')
        // Insert Slide Tracking Data here, or just join?
        InsertSlideStorageDetails(data)

        // Query database for slide details
        // console.log('Start query database for slide details')
        var strSQL = `
          SELECT s.AccessionID,
          s.PartDesignator,
          s.BlockDesignator,
          s.Patient,
          s.StainLabel,
          s.SlideInst,
          s.slidecount,
          s.SiteLabel,
          s.SlideID,
          s.ToBeRequested,
          ss.slidestoragestatus,
          ss.Location,
          ss.slideowner,
          ss.updateddatetime,
          ss.CanBeRequested,
          ss.User,
          ss.BoxID
          FROM   tblSlides as s
            LEFT JOIN tblslidestorage as ss
            on s.SlideID = concat('HSLD',ss.SlideID)
          WHERE  (( ( s.AccessionID ) = '${strAccessionID}' ));`
        console.log(strSQL)

        var con = mysql.createConnection(mysqlConfig)

        con.query(strSQL, function (err, result) {
          if (err) {
            console.log(err)
          } else {
            // if there is no error, you have the result
            // iterate for all the rows in result
            Object.keys(result).forEach(function (key) {
              var row = result[key]
              // Format Date
              row.updateddatetime = dateFormat(row.updateddatetime, 'mm/dd/yyyy h:MM:ss TT')
            })

            // console.log(result)
            response.json(result)
          }
          con.end()
      })
      // End query database
    /*
      .then(result => {
        // return result.json();
        console.log(result.json())
        return result
      })
      .then(data => {
        console.log("data returned:\n", data)
        response.json(data)*/
        // res.send(data);
  //    });
  // */
  // SELECT * FROM OPENLIS.tblSlides where BlockID = "D18-99999_B_1";
  // strSQL = `SELECT * FROM OPENLIS.tblSlides where BlockID = '${strBlockID}';`;
  })
  } catch (error) {
    // error updating slide details
    console.log('catch exception')
    console.log('Unable to load updated slide distribution details')
    console.log(error)
  } finally {
    // Query database for slide details
    // console.log('Start query database for slide details')
    var strSQL = `
      SELECT s.AccessionID,
      s.PartDesignator,
      s.BlockDesignator,
      s.Patient,
      s.StainLabel,
      s.SlideInst,
      s.slidecount,
      s.SiteLabel,
      s.SlideID,
      s.ToBeRequested,
      ss.slidestoragestatus,
      ss.Location,
      ss.slideowner,
      ss.updateddatetime,
      ss.CanBeRequested,
      ss.User,
      ss.BoxID
      FROM   tblSlides as s
        LEFT JOIN tblslidestorage as ss
        on s.SlideID = concat('HSLD',ss.SlideID)
      WHERE  (( ( s.AccessionID ) = '${strAccessionID}' ));`
    console.log(strSQL)

    var con = mysql.createConnection(mysqlConfig)

    con.query(strSQL, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        // if there is no error, you have the result
        // iterate for all the rows in result
        Object.keys(result).forEach(function (key) {
          var row = result[key]
          // Format Date
          row.updateddatetime = dateFormat(row.updateddatetime, 'mm/dd/yyyy h:MM:ss TT')
        })

        // console.log(result)
        response.json(result)
      }
      con.end()
    })
  }
// });
// con.end();
console.log(`Inquire storage on ${strAccessionID}`)

}
function InsertSlideStorageDetails(arSlideStorageDetails) {
  console.log('InsertSlideStorageDetails Start')
  var con = mysql.createConnection(mysqlConfig)
  
  // console.log('apidata:', arSlideStorageDetails);
  let slides = {}
  slides = arSlideStorageDetails.data.slides
  // console.log(arSlideStorageDetails.data.slides[0].casetype)
  //  console.log(temp[0].casetype)
  // console.log(temp.blockid)

  let strTempSQL = ''
  slides.forEach(slide => {
    console.log(slide.blockid)

    // let strSlideID = slide.slideid
    strTempSQL += `
    INSERT INTO openlis.tblslidestorage
    (SlideID,
    SlideStorageStatus,
    Location,
    SlideOwner,
    UpdatedDateTime,
    User,
    BlockID,
    AccessionID,
    CanBeRequested,
    RetrievalRequest)
    VALUES
    ('${slide.slideid}',
    'Archived',
    '${slide.location}',
    'RARS',
    CURRENT_TIMESTAMP,
    'RARS',
    '${slide.blockid}',
    '${slide.accessionid}',
    1,
    0)
    ON DUPLICATE KEY UPDATE 
    SlideStorageStatus = 'Archived',
    Location = '${slide.location}',
    SlideOwner = 'RARS',
    UpdatedDateTime = CURRENT_TIMESTAMP,
    User = 'RARS',
    BlockID = '${slide.blockid}',
    AccessionID = '${slide.accessionid}'
    ;     
  `
  })
  
  console.log(strTempSQL)

  
  con.query(strTempSQL, function (updateerr, updateresult) {
    if (updateerr) {
      console.log('updateerror:', updateerr)
    } else {
      // console.log(strSQLUpdateStatement)
      // console.log(updateresult.affectedRows + ' record(s) updated')
    }
    // Do not end connection, as you need to go through the entire loop
  }) // end update query
  
  con.end()
}
