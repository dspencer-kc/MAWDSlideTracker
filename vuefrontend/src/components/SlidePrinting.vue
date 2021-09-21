<!-- ===========================================================================================



    Authors: Drew Spencer

    Description: This is the compent for slide printing, and is referenced in App.vue

    Notes: Working towards StandardJS.
============================================================================================ -->
<template>
<div class="container"  v-if="this.$store.getters.GetValidUser">
  <div class="mx-auto">

<!--Scan Block......................-->
    <b-form v-on:submit.prevent="pullOrPrintSlides()" inline>
    <div class="customheadertext">
        <h3>Scan BlockID:  </h3>
    </div>
      <b-input id="InputBlockID" class="mb-2 mr-sm-2 mb-sm-0" v-model="blockID" :disabled=inputTextBoxDisabled placeholder="Scan Block to Proceed" />
      <b-button type="submit" variant="primary lg" :disabled=inputButtonDisabled>{{formstatuslabel}}</b-button>
      <b-button id="btnManualBlockIDToggle" :disabled=inputNoBarcodeButtonDisabled v-b-toggle.collapse-manualbockid variant="outline-secondary"> No Barcode </b-button>
       <b-button variant="secondary sm" @click="clearCurrentSlide()">Cancel</b-button>
    </b-form>
  </div>
  <div v-if="loading" class="loader">
    <b-spinner variant="primary" label="Spinning"></b-spinner>
  </div>

  <div v-else-if="error_message">
    <h3>{{ error_message }}</h3>
  </div>
  <b-collapse id="collapse-manualbockid" class="mt-2">
    <b-card>
      <p class="card-text">If you cannot scan the barcode, you can manually input the full block ID in the fields below:<br>**Double check the slides that pull up correspond to the block**</p>
      <b-row>
          <b-col>
            <label>Case Prefix:</label>
          </b-col>
          <b-col>
           <b-input id="InputCasePrefix" v-model="manualcaseprefix" />
          </b-col>
      </b-row>
            <b-row>
          <b-col>
            <label>Year:</label>
          </b-col>
          <b-col>
           <b-input id="InputCaseTwoDigitYear" v-model="manualcasetwodigityear" />
          </b-col>
      </b-row>
      <b-row>
          <b-col>
            <label>Case Number:</label>
          </b-col>
          <b-col>
           <b-input id="InputCaseNo" v-model="manualcasenumber" />
          </b-col>
      </b-row>
            <b-row>
          <b-col>
            <label> Part:</label>
          </b-col>
          <b-col>
           <b-input id="InputPart" v-model="manualpart" />
          </b-col>
      </b-row>
      <b-row>
          <b-col>
            <label> Block: </label>
          </b-col>
          <b-col>
           <b-input id="InputBlock" v-model="manualblock" />
          </b-col>
      </b-row>
      <b-row>
          <b-col>
            <label> Full Block ID:</label>
          </b-col>
          <b-col>
              <label> HBLK{{manualcaseprefix}}{{manualcasetwodigityear}}-{{manualcasenumber}}_{{manualpart}}_{{manualblock}} </label>
          </b-col>
      </b-row>
      <b-row>
          <div class="col-md-12 text-center">
            <b-button type="submit" variant="secondary lg" @click="manuallyLoadBlockID()"> Pull Slides From Manual Block ID</b-button>
          </div>
      </b-row>
    </b-card>
  </b-collapse>
  <br>
  <div class="customsubheadertext">
    <h5>Part {{ this.currentPart }} of {{ this.totalParts }}</h5>
    <h5>Block {{ this.currentBlock }} of {{ this.totalBlocks }}</h5>
    <h5>Slides on this block: {{ slides.length }}</h5>
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
                        {{ result.Patient.substring(0,9) }}
                        </div>
                      <div class=slidebody>
                      {{ result.StainLabel }}<br>
                      Level {{ result.SlideInst}} of {{ result.slidecount}}<br>
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
import axios from 'axios'
import store from '../store.js'

export default {
  name: 'slides', // component name
  props: {

    lastname: String,
    userid: String,

    },
    data() {
    return {
      blockID: '',
      error_message: '',
      loading: false, // to track when app is retrieving data
      slides: {},
      formstatus: 'loadslides',
      formstatuslabel: 'Load Slides',
      info: null,
      totalBlocks: null,
      currentBlock: null,
      totalParts: null,
      currentPart: null,
      manualblockid: null,
      manualcaseprefix: null,
      manualcasetwodigityear: '19',
      manualcasenumber: null,
      manualaccid: null,
      manualpart: null,
      manualblock: null
    }
  },


  sockets: {
      connect: function () {
          console.log('socket connected within slide')
      },
      customEmit: function (data) {
          console.log(' within slide this method was fired by the socket server. eg: io.emit("customEmit", data)')
      },
      stream: function(data) {
          console.log("SOCKET STREAM SLIDE DIST")
          this.validateScanData(data)
      }
  },
  methods: {
    validateScanData(data){
      if (store.state.validuser) {
        store.commit('SetSlideQueuePath', data.slideQueuePath)
        store.commit('SetStationName', data.stationName)
        //Depending on prefix, send to correct placeholder
        console.log("SLIDE PRINTER: "+this.$route.name)
        switch(data.barcodeScanData.substring(0,4)) {
          case 'HBLK':
            this.blockID = data.barcodeScanData
            this.pullSlides();
            break
          case 'SBDG':
            break
          case 'HSLD':
          this.blockID = 'Scan block not slide'
            break
          default:
            // code block
        }
      } else {
        this.blockID = ''
      }

    },
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

      axios.post(store.getters.getApiUrl + '/printSlides', {
      action: 'PrintSlides',
      blockID: this.blockID,
      printRequestedBy: store.state.username,
      slideQueuePath: store.state.slideQueuePath,
      printLocation: store.state.stationName,
      curRoute : this.currentRouteName

      })
      .then(function (response) {
      console.log('slides printed')
      console.log(response.info)
      if (response.files){
        this.makeToast("Files waiting to be printed:\n "+response.files, "Slide Printer Issues", "danger",10000)
      }
      })
      .catch(function (error) {
      console.log(error)
      });

    //Done printing, scan new block
    this.formstatus = 'loadslides'
    this.formstatuslabel = 'Load Slides'
    this.clearCurrentSlide()
    console.log("Done printing slides")
  },

    pullSlides() {
      console.log('start pull slides');
      //this.GetPartBlockCurrentAndTotals()
      let blockID = this.blockID
      if (!blockID) {
        alert('please enter block ID to pull up slides')
        return
      }
      this.loading = true


      axios.post(store.getters.getApiUrl + '/pullSlides', {blockID: blockID})
        .then(data => {
          this.loading = false
          this.error_message = ''
          console.log(this.currentRouteName)
          this.slides = data.data;
          this.formstatus = 'readytoprint';
          document.getElementById("InputBlockID").disabled = true;
          this.formstatuslabel = 'Print Slides';
        }).catch((e) => {
          console.log(e)
        })
        this.GetPartBlockCurrentAndTotals()
    },
    updateSlideToPrintValue(strSlideID, blChecked) {
            //Send api the following:  action: UpdateSlideToPrint slideid=? value=?
      axios.post(store.getters.getApiUrl + '/updateSlideToPrint', {
        action: 'UpdateSlideToPrintValue',
        slideId: strSlideID,
        toPrintStatus: blChecked,
        curRoute : this.currentRouteName
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    },
    GetPartBlockCurrentAndTotals() {
        console.log('start GetPartBlockCurrentAndTotals')
              axios.post(store.getters.getApiUrl + '/getPartBlockCurrentAndTotals', {
              blockID: this.blockID,
              curRoute : this.currentRouteName
            })
            .then(apidata => {
              this.loading = false;
              this.error_message = '';
              if (apidata.errorcode) {
                this.error_message = `Error looking up badge.`
                console.log('error')
                return
              }
              //console.log('apidata:', apidata);
              let temp = {}
              temp = apidata.data
              console.log(temp)
              this.totalBlocks = temp.totalblocks
              this.currentBlock = temp.currentblock
              this.totalParts = temp.totalparts
              this.currentPart = temp.currentpart


            }).catch((e) => {
              console.log(e)
            })
            .catch(function (error) {
              console.log("error:")
              console.log(error)
            })
    },
    clearCurrentSlide(){
      console.log("hellocancelbutton")
      this.blockID =""
      this.formstatus = 'loadslides'
      this.formstatuslabel = 'Load Slides'
      this.totalBlocks = ''
      this.currentBlock = ''
      this.totalParts = ''
      this.currentPart = ''
      this.slides = {}
      this.setFocusToInputBlockID()
    },
    setFocusToInputBlockID(){
      document.getElementById("InputBlockID").focus();
    },
    manuallyLoadBlockID(){
      this.blockID = "HBLK" + this.manualcaseprefix + this.manualcasetwodigityear + '-' + this.manualcasenumber + '_' + this.manualpart + '_' + this.manualblock
      this.pullSlides()
      //Collapse additional options
      document.getElementById("btnManualBlockIDToggle").click()
    },
    makeToast(content, title, variant = null,time=1500,locn='b-toaster-top-left') {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: time,
        toaster: locn,
        appendToast: true
      })
    }
  },
  computed:{
    inputButtonDisabled(){
      //if (this.validuser=='f' || !blockID ) {
      if (store.state.validuser && this.blockID) {
        return false;
      } else {
        return true;
      }
    },
    inputTextBoxDisabled(){
      return true
    },
    inputNoBarcodeButtonDisabled(){
      //if (this.validuser=='f' || !blockID ) {
      if (store.state.validuser && !this.blockID) {
        return false
      } else {
        return true
      }
    },
    currentRouteName() {
      return this.$route.name;
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
