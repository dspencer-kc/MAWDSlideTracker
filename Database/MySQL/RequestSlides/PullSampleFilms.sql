set @locationcount=0;
select substring(SlideID, 5) as slideid,
  substring(BlockID,5) as blockid,
  AccessionID as accessionid,
  StainLabel as stain,
  'MAWD' as sitelabel,
  StainOrderDate as stainorderdate,
  substring(AccessionID, 1, instr(accessionid,'-')-3)
  as casetype,
    substring(AccessionID,locate('-',AccessionID)-2,2) as year,
  'Location' + @locationcount:=@locationcount + 1 as location,
  'Box1' as box_id
from tblslides
