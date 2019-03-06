<!-- ===========================================================================================

    File: SlidesV3.vue

    Authors: Drew Spencer

    Description: This is the compent for slide printing, and is referenced in App.vue

    Notes: Working towards StandardJS.
============================================================================================ -->
<template>


<div class="container">
  <div class="mx-auto">

<!--Scan Block......................-->
    <b-form v-on:submit.prevent="pullOrPrintSlides()" inline>
    <div class="customheadertext">
        <h3>Scan BlockID:  </h3>
    </div>
      <b-input id="InputBlockID" class="mb-2 mr-sm-2 mb-sm-0" v-model="blockID" :disabled=inputTextBoxDisabled placeholder="Touch Here then Scan Block" />
      <b-button type="submit" variant="primary lg" :disabled=inputButtonDisabled>{{formstatuslabel}}</b-button>
       <b-button variant="secondary sm" @click="clearCurrentSlide()">Cancel</b-button>
    </b-form>
  </div>
  <div v-if="loading" class="loader">
    <img src="../assets/loader-large.gif" alt="loader">
  </div>

  <div v-else-if="error_message">
    <h3>{{ error_message }}</h3>
  </div>

  <br>
  <div class="customheadertext">
    <h4> Number of slides:{{ slides.length }}</h4>
  </div>

<div class="container">
 <div class="row row-flex">
  <!--<div class="col-sm-2 mt-2" v-for="result in slides">-->


        <div class="col-md-2 col-sm-6" v-for="result in slides">
           <div class="glassslide">
             <label>
             <div class=slidelabel>
                    <div class=slideheader>
                        {{ result.AccessionID }}-{{ result.PartDesignator }}{{ result.BlockDesignator }}<br>
                        {{ result.Patient.substring(0,10) }}
                        </div>
                      <div class=slidebody>
                      {{ result.StainLabel }}<br>
                      Level {{ result.SlideInst}} of {{ result.SlideCount}}<br>
                      {{ result.StainOrderDate}}<br>
                      {{ result.OrderPathInitials}}<br>
                      </div>

                      <div class=slidefooter>
                      {{ result.SiteLabel}}

                      </div>
            </div> <!-- /Slidelabel -->
              <p>
            {{ result.SlideDistributionKeyword}}
              <br>


                <br><br>
                Print Slide <input type="checkbox"
                              v-model=result.ToBePrinted
                              @change="updateSlideToPrintValue(result.SlideID, result.ToBePrinted)"
                              >
                  <br><br>
                  Status:
                  <br>
                  {{ result.Status}}
              </p>
            </label>

            </div> <!-- /GlassSlide -->
          </div>
    </div>
  </div>
</div>
<!-- /container -->
</template>


<!--components/Slides.vue -->
<script>
import axios from 'axios';


// define the external API URL
const API_URL = 'http://localhost:3000/slidetracker/slideparameters?blockid='
// Helper function to help build urls to fetch slide details from blockid
function buildUrl(blockID) {
  return `${API_URL}${blockID}`
}
export default {
  name: 'slides', // component name
  props: {
    username: String,
    firstname: String,
    lastname: String,
    userid: String,
    background: String,
    validuser: Boolean,
    blockID: String
    },
    data() {
    return {
      //blockID: '',
      error_message: '',
      loading: false, // to track when app is retrieving data
      slides: {},
      formstatus: 'loadslides',
      formstatuslabel: 'Load Slides',
      info: null
    }
  },
  methods: {
    pullOrPrintSlides()
    {

      if (this.formstatus == 'loadslides') {
        this.pullSlides();

      }
    else if (this.formstatus == 'readytoprint') {
      console.log('goto print slides');
      this.printSlides();
    }{

    }

  },

  printSlides()
  {
    console.log('start print slides');

    //Send api the following:  action: UpdateSlideToPrint slideid=? value=?
    //Add printRequestedBy

      axios.post('http://localhost:3000/printslides', {
      action: 'PrintSlides',
      blockID: this.blockID,
      printRequestedBy: this.username

      })
      .then(function (response) {
      console.log(response);
      })
      .catch(function (error) {
      console.log(error);
      });

    //Done printing, scan new block
    this.formstatus = 'loadslides';
    this.formstatuslabel = 'Load Slides';
    this.clearCurrentSlide()
    console.log("Done printing slides")
  },

    pullSlides() {
      console.log('start pull slides');
      let blockID = this.blockID
      if (!blockID) {
        alert('please enter block ID to pull up slides')
        return
      }
      this.loading = true

      //uses fetch as opposed to Axios
      fetch(buildUrl(blockID))
        .then(response => response.json())
        .then(data => {
          this.loading = false
          this.error_message = ''

          if (data.errorcode) {
            this.error_message = `Sorry, block with blockID '${blockID}' not found.`
            console.log('error')
            return
          }
          this.slides = data;
          this.formstatus = 'readytoprint';
          document.getElementById("InputBlockID").disabled = true;
          this.formstatuslabel = 'Print Slides';
          console.log("Made it to this.slide=data");
          console.log(data);
        }).catch((e) => {
          console.log(e)
        })
    },
    updateSlideToPrintValue(strSlideID, blChecked)
    {
        //Send api the following:  action: UpdateSlideToPrint slideid=? value=?
    axios.post('http://localhost:3000/updateslidetoprint', {
    action: 'UpdateSlideToPrintValue',
    slideId: strSlideID,
    toPrintStatus: blChecked
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

    },
    clearCurrentSlide(){
      console.log("hellocancelbutton")
      this.blockID ="";
      this.formstatus = 'loadslides';
      this.formstatuslabel = 'Load Slides';
      document.getElementById("InputBlockID").disabled = false;
      this.slides = {}
      this.setFocusToInputBlockID()
    },
    setFocusToInputBlockID(){
      document.getElementById("InputBlockID").focus();
    },
  },
  computed:{
    inputButtonDisabled(){
      //if (this.validuser=='f' || !blockID ) {
      if (this.validuser && this.blockID) {
        return false;
      } else {
        return true;
      }
    },
    inputTextBoxDisabled(){
      //if (this.validuser=='f' || !blockID ) {
      if (this.validuser) {
        return false;
      } else {
        return true;
      }
    }
  }
}
</script>

<style scoped>
#slides {
  margin: 30px 0;
}

.loader {
  text-align: center;
}
</style>
