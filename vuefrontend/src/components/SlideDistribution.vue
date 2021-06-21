// Slide Distribution.vue

<template>
<div class="container">
  <div class="mx-auto">

<!--Scan Block......................-->
    <b-form v-on:submit.prevent inline>
    <div class="customheadertext">
        <h3>{{strInputTextLabel}}  </h3>
    </div>
      <b-input id="InputFromScanner" class="mb-2 mr-sm-2 mb-sm-0" v-model="inputtext" disabled placeholder="Scan Slide Tray to Proceed" />
      <b-button type="submit" variant="primary lg" disabled>{{formstatuslabel}}</b-button>
       <b-button variant="secondary sm" @click="Cancel()">Cancel</b-button>
        <div class = 'pl-5'>
          <b-form-group>
          <b-form-radio-group
              id="rdSlideTrayBehavior"
              v-model="rdSlideTrayBehaviorSelected"
              :options="rdSlideTrayBehaviorOptions"
              buttons
              name="radios-btn-default"
          ></b-form-radio-group>
          </b-form-group>
        </div>


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
    <p v-bind:style="getColor(currentslidetray)" >Current Slide Tray: {{currentslidetray}}    Slide Count in Tray: {{strInTraySlideCount}}    Block Count in Tray: {{strInTrayBlockCount}}</p>
    <h5>Slide Details in Current Tray: </h5>
  </div>

  <div class='col-xs-6'>


    <table  class="table table-dark ">
      <tr>
        <th>Slide ID</th>
        <th>Case Slides In Tray</th> 
        <th>Case Slides Total</th>
        <th>Case Slides Not In Tray</th>
      </tr>
      <template v-for="result in slides">        
      <tr>
        <td>{{ result.SlideID }}</td>
        <td>{{ result.CaseSlidesInTray }}</td> 
        <td>{{ result.CaseSlidesTotal }}</td>
        <td>{{ result.CaseSlidesNotInTray }}</td>
      </tr>
      </template>
    </table>
    <ul>
       
    </ul>
  

    <blockcount> </blockcount>

  
</div>
  </div>
<!-- /container -->
    
</template>

<script>
import store from '../store.js'
import axios from 'axios'
import blockcount from './BlockCountChart.vue'

export default {
name: 'SlideDistribution',
components: {
    blockcount  
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
  strInputTextLabel: 'Scan Slide Tray: ',
  slides: {},
  obApiResult02: {},
  obApiResult03: {},
  strInTrayBlockCount: '',
  strInTraySlideCount: '',
  rdSlideTrayBehaviorSelected: 'NewSlideTray',
  rdSlideTrayBehaviorOptions: [
    { text: 'New Slide Tray', value: 'NewSlideTray', disabled: false },
    { text: 'Edit Existing Slide Tray', value: 'EditExisting', disabled: false },
  ]
}
},
mounted() {
  console.log('MOUNTED - LOADING TABLE DATA')
  this.LoadTableData()
  
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
            this.MarkSlideToBeDistributed(strSlideID, this.SlideDistributionID)
          } else {
            this.CreateNewSlideDistribution(strSlideID)
            // call this.MarkSlideToBeDistributed(strSlideID) after new slide distribution found
            // this.blFirstSlideScanned = true
          }
        } else {
          this.inputtext = 'Scan Slide Tray First'
        }
    },
    MarkSlideToBeDistributed(strSlideID, strSlideDistributionID){
      // Call Mark Slides To Be Distributed API to mark all slides scanned as pending distribution
      console.log('Hello MarkSlideToBeDistributed')

      //Only mark id slide tray is loaded
      if (this.blSlideTrayLoaded) {
          // Call MarkSlideToBeDistributed
      // This calls  4 queries.
      //  0 - set status InTrayPendingLocation of current slide, and sets slide distrib id
      //  1 - returns all slides under the current slide distr id to show slides in current tray
      //  2 - Returns Tray's block Count
      //  3 - Returns Tray's Slide count

      axios.post(store.state.apiURL + '/slidedistribution', {
      action: 'MarkSlideToBeDistributed',
      slidedistid: strSlideDistributionID,
      slideid: strSlideID
      })
      .then(apidata => {
        this.loading = false;
        this.error_message = '';
        if (apidata.errorcode) {
        this.error_message = `Error MarkSlideToBeDistributed.`
        console.log('error')
        return
        }
        // console.log('MarkSlideToBeDistributed apidata:')
        // console.log(apidata)
        let temp = {}
        temp = apidata.data
        console.log(temp)
        this.slides = temp[1]
        // let aryTmpSlidesInTray = {}
        this.obApiResult02 = temp[2]
        this.strInTraySlideCount = this.obApiResult02[0].SlidesInTray
        this.obApiResult03 = temp[3]
        this.strInTrayBlockCount = this.obApiResult03[0].BlockCountInTray
        // console.log(temp)
        // this.SlideDistributionID = temp.insertId
        // Update block count table
        console.log('MarkSlideToBeDistributed - LOADING TABLE DATA')
        this.LoadTableData()

      }).catch((e) => {
        console.log(e)
      })
      .catch(function (error) {
        console.log("error:")
        console.log(error)
      })          
      } else {
          this.inputtext = 'Scan Slide Tray Before Slide'
      }      
    },
    CreateNewSlideDistribution(strSlideID){
      //Only create new slide distribution if New Slide Tray, otherwise, existing tray has already been loaded. 

      switch (this.rdSlideTrayBehaviorSelected) {
        case 'EditExisting':
          console.log('hello edit existing at create new slide distribution')
          // Already have slide distribution ID, do not get new one.
          this.blFirstSlideScanned = true
          this.MarkSlideToBeDistributed(strSlideID, temp.insertId)          
          break
      
        default:
          // Clear Slide Distrib ID
          this.SlideDistributionID = null
          // Call API to create new slide distribution for slide tray.
          console.log('Hello Create New Slide Dsitribution')
          axios.post(store.state.apiURL + '/slidedistribution', {
          action: 'CreateNewSlideDistribution',
          userid: store.state.username,
          slidetray: this.slidetrayID,
          scanlocation: store.state.stationName
          })
          .then(apidata => {
            this.loading = false;
            this.error_message = '';
            if (apidata.errorcode) {
            this.error_message = `Error creating new slide distribution.`
            console.log('error')
            return
            }
            // console.log('apidata:')
            // console.log(apidata)
            let temp = {}
            temp = apidata.data
            console.log('Create New Slide Distr Done, call MarkSlideToBeDistributed')
            this.SlideDistributionID = temp.insertId
            console.log('Slide Distr id:')
            console.log(temp.insertId)
            this.blFirstSlideScanned = true
            this.MarkSlideToBeDistributed(strSlideID, temp.insertId)

          }).catch((e) => {
            console.log(e)
          })
          .catch(function (error) {
            console.log("error:")
            console.log(error)
          })
          break
      }
    },
    getInputColor (text) {
if(text != "No Slide Tray Active" ) return { 'background-color' : '#96ceb4' };
if(text == "No Slide Tray Active" ) return { 'background-color' : '#ff6f69' };
},
    ScanSlideTray(strSlideTrayID){
        if (this.blSlideTrayLoaded === false) {
            this.blSlideTrayLoaded = true
            this.slidetrayID = strSlideTrayID
            this.currentslidetray = this.slidetrayID

            if (this.rdSlideTrayBehaviorSelected === 'EditExisting') {
             
              // Get slidedistr id from slide tray and load slides
              console.log('Hello Edit Existing Scan Slide Tray')
              this.loading = 'true'
              axios.post(store.state.apiURL + '/slidedistribution', {
              action: 'LoadSlideTray',
              userid: store.state.username,
              slidetray: this.slidetrayID,
              scanlocation: store.state.stationName
              })
              .then(apidata => {
                this.loading = false;
                this.error_message = '';
                if (apidata.errorcode) {
                  this.error_message = `Error loading existing slide distr.`
                  console.log('error')
                  return
                }
                console.log('Scan Slide Tray edit existing apidata:')
                console.log(apidata)
                let temp = {}
                temp = apidata.data
                
                // console.log('Slide Result Object:')
                // console.log(temp)
                // console.log(temp[0][0].CurrentSlideDistID)
                this.SlideDistributionID = temp[0][0].CurrentSlideDistID
                
                console.log('Current Slide Distr id:')
                console.log(this.SlideDistributionID)

                //Load Slide Tray now
                this.slides = temp[1]
                // console.log(this.slides)
                // let aryTmpSlidesInTray = {}
                this.obApiResult02 = temp[2]
                this.strInTraySlideCount = this.obApiResult02[0].SlidesInTray
                this.obApiResult03 = temp[3]
                this.strInTrayBlockCount = this.obApiResult03[0].BlockCountInTray
                // console.log(temp)
                // this.SlideDistributionID = temp.insertId
                // Update block count table
                console.log('Prior to load table data')

                //disable New Slide Tray Option
                this.rdSlideTrayBehaviorOptions[0].disabled = true
				console.log('ScanSlideTray - NOT LOADING TABLE DATA')
                //this.LoadTableData()
                

              }).catch((e) => {
                console.log(e)
              })
              .catch(function (error) {
                console.log("error:")
                console.log(error)
              })

            } else {
            console.log('Hello new slide tray')
            //disable Edit Existing Slide Tray Option
                this.rdSlideTrayBehaviorOptions[1].disabled = true
            }
            this.inputtext = 'Scan Slide to Proceed'
            this.strInputTextLabel = 'Scan Slide: '
        } else {
            this.inputtext = 'Scan Slide or Location to close Slide Tray'
        }
    },
    ScanLocation(strLocID){
        if (this.blSlideTrayLoaded) {
          this.loading = true
          this.MarkSlidesReadyForCourier(strLocID)
        } else {
            this.inputtext = 'Scan Slide Tray Before Location'
        }
        

    },
    MarkSlidesReadyForCourier(strLocID){
      //  Need to handle if first slide has not been scanned, tray needs to be assigned new location
      // Call Distribute Pending Slides API to send all pending slides to scanned location.

      if (this.blFirstSlideScanned) {
        axios.post(store.state.apiURL + '/slidedistribution', {
        action: 'MarkSlidesReadyForCourier',
        slidedistid: this.SlideDistributionID,
        userid: store.state.username,
        slidedistrloc: strLocID,
        scanlocation: store.state.stationName
        })
        .then(response => {
            // console.log(response)
            this.slidetrayID = ''
            this.blSlideTrayLoaded = false
            this.blFirstSlideScanned = false
            this.currentslidetray = 'Waiting for Next Slide Tray'
            this.inputtext = 'Scan Slide Tray to Proceed'
            this.strInputTextLabel = 'Scan Slide Tray:'      
            this.slidedistid = null
            this.loading = false
            this.strInTrayBlockCount = ''
            this.strInTraySlideCount = ''
            this.slides = {}
            //Clear Slide Distrib ID
            this.SlideDistributionID = null
            
            //Enable Radio Buttons
            this.rdSlideTrayBehaviorOptions[1].disabled = false
            this.rdSlideTrayBehaviorOptions[0].disabled = false

            console.log('MarkSlidesReadyForCourier - LOADING TABLE DATA')
            this.LoadTableData()
        })
        .catch((error) => {
            console.log(error)
            this.loading = false
            this.inputtext = 'Error'
        })
      } else {
      // Slide tray scanned location without any slides, need to get slide distr id and assign location
      axios.post(store.state.apiURL + '/slidedistribution', {
        action: 'AssignTrayNewLocation',
        userid: store.state.username,
        slidedistrloc: strLocID,
        scanlocation: store.state.stationName,
        slidetray: this.slidetrayID
        })
        .then(response => {
          // console.log(response)
            this.slidetrayID = ''
            this.blSlideTrayLoaded = false
            this.currentslidetray = 'Waiting for Next Slide Tray'
            this.inputtext = 'Scan Slide Tray to Proceed'
            this.strInputTextLabel = 'Scan Slide Tray:'      
            this.loading = false
          //Clear Slide Distrib ID
          this.SlideDistributionID = null
          console.log('else - NOT LOADING TABLE DATA')
          //this.LoadTableData()
        })
        .catch((error) => {
            console.log(error)
            this.loading = false
            this.inputtext = 'Error'
        })  
      }
      
    },
    LoadTableData() {
        store.dispatch('LoadBlockCountTableData').then(() => {
        // console.log('Show after promise blah')
        // this.datacollection = store.state.objChartDataCollection
        // console.log(store.state.blockCountTableItems)
        }) 
    },
    Cancel() {
      console.log('hello cancel')
      this.slidetrayID = ''
      this.blSlideTrayLoaded = false
      this.blFirstSlideScanned = false
      this.currentslidetray = 'Waiting for Next Slide Tray'
      this.inputtext = 'Scan Slide Tray to Proceed'
      this.strInputTextLabel = 'Scan Slide Tray:'      
      this.slidedistid = null
      this.loading = false
      this.strInTrayBlockCount = ''
      this.strInTraySlideCount = ''
      this.slides = {}
      this.SlideDistributionID = null
      //unlock radio button
      //Enable Radio Buttons
      this.rdSlideTrayBehaviorOptions[1].disabled = false
      this.rdSlideTrayBehaviorOptions[0].disabled = false
    }

},
computed: {
}
</script>
\
