/*qryUpdatetblActionTrackingSlidesPrinted*/
INSERT INTO OPENLIS.tblActionTracking (
  Action,
  IDOfMaterial,
  User,
  Station,
  ActionDateTime,
  Count
)
VALUES (
  'SlidesPrintedOffBlock',
  'HBLKMPS19-99999_B_1',
  'TESTUser',
  'TESTStations',
  NOW(),
  1
);