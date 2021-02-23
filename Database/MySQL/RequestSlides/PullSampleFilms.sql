set @locationcount=0;
select SlideID,
  BlockID,
  AccessionID,
  StainID as stain,
  StainOrderDate,
  substring(AccessionID, 1, instr(accessionid,'-')-3)
  as CaseType,
    substring(AccessionID,locate('-',AccessionID)-2,2) as Year,
  1 as TS,
  'Location' + @locationcount:=@locationcount + 1 as LOCATION,
  'Box1' as BOX_ID
from tblslides