# MAWDSlideTracker

MAWD Slide Tracker is designed to track slides and blocks for a histology lab and runs on top of an APLIS (currently CernerCopath Plus running on Sybase).  This project was started by our lab to enhance our cassette and slide tracking abilities.  Inspiration and solution architecture was taken from the OPENLIS project.  In continuing with the ideas of the OPENLIS movement, the MAWDSlideTracker (or whatever we end up calling it) is designed for another lab to be able to reuse the code.  However, to get the project off the ground, it is very much tied to our specific lab and lab software setup.

## Contributers

MAWD IT is writing most of the code, myself, Drew Spencer and Jami Shelton contributing  but this would never have started without Sid's help and continued support.

## Table Description and Data Sources

MAWD Slide tracker 3 main tables:  tblSlides, tblBlocks and copath_p_stainprocess.  The stain orders come from our LIS and are imported from our LIS database in to p_stainprocess.  There is a Mirth channel that runs approximately every 5 minutes to import the data from our read only connection to our LIS.  tblBlocks contains the block information and is populated when cassettes are engraved.  Our LIS saves a flatfile for the cassette engraver to use.  This flatfile is ran through Mirth and the information (along with additonal information grabbed from our LIS tables) is used to populate tblBlocks.  The third table, tblSlides is currently populated after the stain orders is inserted.  Any new stain orders are matched with tblBlocks and slides are created into tblSlides.


More info to come.
