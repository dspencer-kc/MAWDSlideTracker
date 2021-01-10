SELECT s.AccessionID,
s.PartDesignator,
s.BlockDesignator,
s.Patient,
s.StainLabel,
s.SlideInst,
s.slidecount,
s.SiteLabel,
s.SlideID,
ss.slidestoragestatus,
ss.slidelocationid,
ss.slideowner,
ss.updateddatetime
FROM   tblSlides as s
  LEFT JOIN tblslidestorage as ss
  on s.SlideID = ss.SlideID
WHERE  (( ( s.AccessionID ) = 'D18-99999' ));