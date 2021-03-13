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

