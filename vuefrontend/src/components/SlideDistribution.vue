// Slide Distribution.vue

<template>
<div class="container">
  <div class="mx-auto">

<!--Scan Block......................-->
    <b-form v-on:submit.prevent="pullOrPrintSlides()" inline>
    <div class="customheadertext">
        <h3>{{strInputTextLabel}}  </h3>
    </div>
      <b-input id="InputFromScanner" class="mb-2 mr-sm-2 mb-sm-0" v-model="inputtext" disabled placeholder="Scan Slide Tray to Proceed" />
      <b-button type="submit" variant="primary lg" disabled>{{formstatuslabel}}</b-button>
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
  <div class="customsubheadertext">
    <p> **To reassign location on a tray, scan slide tray, then location without scanning another slide, whenever you scan a slide tray and then scan a slide, it clears all the slides that were previously tied to that slide.** </p>
    <h5>Current Slide Tray: {{currentslidetray}} </h5>
    <h5>Slides in Current Tray: </h5>
  </div>

<div class="container">
 <div class="row row-flex">
  <!--<div class="col-sm-2 mt-2" v-for="result in slides">-->


    </div>
  </div>
</div>
<!-- /container -->
    
</template>

<script>
import store from '../store.js'
import axios from 'axios'

export default {
name: 'SlideDistribution',
components: {
  
},
data() {
return {
  formstatus: 'loadslides',
  formstatuslabel: 'Scan',
  currentslidetray: 'No Slide Tray Active',
  inputtext: '',
  slidetrayID: '',
  error_message: '',
  loading: false, // to track when app is retrieving data
  blSlideTrayLoaded: false,
  blFirstSlideScanned: false,
  SlideDistributionID: null,
  strInputTextLabel: 'Scan Slide Tray: '

}
},
mounted() {
  console.log('Hello component created')
},
  sockets: {
      connect: function () {
          console.log('socket connected within slide')
      },
      customEmit: function (data) {
          console.log(' within slide this method was fired by the socket server. eg: io.emit("customEmit", data)')
      },
      stream: function(data) {
          console.log('socket on within slide')
          console.log('within slide:',data)
          //validate scan data
          this.validateScanData(data)
      }
  },
methods: {
    validateScanData(data){
      if (store.state.validuser) {
        console.log('Slide Queue Path: ', data.slideQueuePath)
        store.commit('SetSlideQueuePath', data.slideQueuePath)
        console.log('slide station name:', data.stationName)
        store.commit('SetStationName', data.stationName)
        //Depending on prefix, send to correct placeholder
        console.log('slide: barcodescan', data.barcodeScanData)
        console.log('slide: prefix', data.barcodeScanData.substring(0,4))

        switch(data.barcodeScanData.substring(0,4)) {
          case 'HBLK':
            //BlockScan Detected

            console.log('Hello HBLK')
            this.inputtext = 'Cannot scan block here.'
            break
          case 'HSLD':
            // Slide
            this.ScanSlide(data.barcodeScanData)
            break
          case 'LOCN':
            // Slide distribution location
            this.ScanLocation(data.barcodeScanData)
            break
          case 'SLTR':
            // Slide Tray
            this.ScanSlideTray(data.barcodeScanData)
            break
          default:
            // code block
        }
      } else {
        this.inputtext = ''
      }

    },
    ScanSlide(strSlideID) {
        console.log('Hello scanslide')
        console.log(strSlideID)
        this.inputtext = strSlideID

        if (this.blSlideTrayLoaded) {
          if (this.blFirstSlideScanned) {
            this.MarkSlideToBeDistributed(strSlideID)
          } else {
            this.CreateNewSlideDistribution(strSlideID)
            this.MarkSlideToBeDistributed(strSlideID)
            this.blFirstSlideScanned = true
          }
        } else {
          this.inputtext = 'Scan Slide Tray First'
        }
    },
    MarkSlideToBeDistributed(strSlideID){

    },
    CreateNewSlideDistribution(strSlideID){

    },
    ScanSlideTray(strSlideTrayID){
        if (this.blSlideTrayLoaded === false) {
            this.blSlideTrayLoaded = true
            this.slidetrayID = strSlideTrayID
            this.currentslidetray = this.slidetrayID
            this.inputtext = 'Scan Slide to Proceed'
            this.strInputTextLabel = 'Scan Slide: '

        } else {
            this.inputtext = 'Scan Slide or Location to close Slide Tray'
        }
    },
    ScanLocation(strLocID){
        this.slidetrayID = ''
        this.blSlideTrayLoaded = false
        this.currentslidetray = 'Waiting for Next Slide Tray'
        this.inputtext = 'Scan Slide Tray to Proceed'
        this.strInputTextLabel = 'Scan Slide Tray:'
        this.DistributePendingSlides(strLocID)
    },
    DistributePendingSlides(strLocID){
      // Call Distribute Pending Slides API to send all pending slides to scanned location.
      axios.post(strApiUrl + '/slidedistribution', {
      action: 'DistributePendingSlides',
      // blockID: this.blockID,
      // printRequestedBy: store.state.username,
      // slideQueuePath: store.state.slideQueuePath
      })
      .then(function (response) {
      console.log(response);
      })
      .catch(function (error) {
      console.log(error);
      });
    }

},
computed: {
} 
}
</script>