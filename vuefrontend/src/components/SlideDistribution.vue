// Slide Distribution.vue


<template >
<div class="container" v-if="this.$store.getters.GetValidUser" >
  <b-navbar class="navbar navbar-dark bg-dark m-auto ">
    <b-nav-item class="navbar-brand">Current Slide:  <b-badge :model="currentslidetray" :style="getInputColor(currentslidetray)">{{currentslidetray}}   </b-badge></b-nav-item>
    <b-nav-item class="navbar-brand">Slide Count:    <b-badge>{{strInTraySlideCount}} </b-badge></b-nav-item>
    <b-nav-item class="navbar-brand">Block Count:    <b-badge>{{strInTrayBlockCount}} </b-badge></b-nav-item>
    <b-button>{{formstatuslabel}}</b-button><b-button @click="Cancel()">Cancel</b-button>
    <b-form-radio-group id="rdSlideTrayBehavior" v-model="rdSlideTrayBehaviorSelected" :options="rdSlideTrayBehaviorOptions" buttons name="radios-btn-default"></b-form-radio-group>  </b-form-group>
  </b-navbar>


  <div class='col-xs-6'>
    <table  class="table table-dark" v-if="this.slides.length>0">
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
  defaultcurrentslidetray: 'No Slide Tray Active',
  nextslidetray: 'Waiting for Next Slide Tray',
  inputtext: '',
  slidetrayID: '',
  error_message: '',
  loading: false, // to track when app is retrieving data
  blSlideTrayLoaded: false,
  blFirstSlideScanned: false,
  SlideDistributionID: null,
  strInputTextLabel: 'Scan Slide Tray: ',
  defaultstrInputTextLabel: 'Scan Slide Tray: ',
  slides: {},
  obApiResult02: {},
  obApiResult03: {},
  strInTrayBlockCount: '0',
  strInTraySlideCount: '0',
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
        store.commit('SetSlideQueuePath', data.slideQueuePath)
        store.commit('SetStationName', data.stationName)
        //Depending on prefix, send to correct placeholder

        switch(data.barcodeScanData.substring(0,4)) {
          case 'HBLK':
            //BlockScan Detected
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
        this.inputtext = strSlideID

        if (this.blSlideTrayLoaded) {
          if (this.blFirstSlideScanned) {
            this.MarkSlideToBeDistributed(strSlideID, this.SlideDistributionID)
          } else {
            this.CreateNewSlideDistribution(strSlideID)
          }
        } else {
          this.inputtext = 'Scan Slide Tray First'
        }
    },
    MarkSlideToBeDistributed(strSlideID, strSlideDistributionID){
      //Only mark id slide tray is loaded
      if (this.blSlideTrayLoaded) {

      axios.post(store.getters.getApiUrl + '/slidedistribution', {
      action: 'MarkSlideToBeDistributed',
      slidedistid: strSlideDistributionID,
      slideid: strSlideID
      })
      .then(apidata => {
        this.loading = false;
        this.error_message = '';
        if (apidata.errorcode) {
        this.error_message = `Error MarkSlideToBeDistributed.`
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
          // Already have slide distribution ID, do not get new one.
          this.blFirstSlideScanned = true
          this.MarkSlideToBeDistributed(strSlideID, temp.insertId)
          break

        default:
          // Clear Slide Distrib ID
          this.SlideDistributionID = null
          // Call API to create new slide distribution for slide tray.
          axios.post(store.getters.getApiUrl + '/slidedistribution', {
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
            return
            }
            // console.log('apidata:')
            // console.log(apidata)
            let temp = {}
            temp = apidata.data
            this.SlideDistributionID = temp.insertId
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
        console.log("TEXT: "+text);
        if(text != this.defaultcurrentslidetray && text != this.nextslidetray) return  'success' ;
        if(text == this.defaultcurrentslidetray ||  text == this.nextslidetray) return  'danger' ;
},
    ScanSlideTray(strSlideTrayID){
        if (this.blSlideTrayLoaded === false) {
            this.blSlideTrayLoaded = true
            this.slidetrayID = strSlideTrayID
            this.currentslidetray = this.slidetrayID

            if (this.rdSlideTrayBehaviorSelected === 'EditExisting') {

              // Get slidedistr id from slide tray and load slides
              this.loading = 'true'
              axios.post(store.getters.getApiUrl + '/slidedistribution', {
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
                console.log(apidata)
                let temp = {}
                temp = apidata.data


                this.SlideDistributionID = temp[0][0].CurrentSlideDistID
                //Load Slide Tray now
                this.slides = temp[1]

                this.obApiResult02 = temp[2]
                this.strInTraySlideCount = this.obApiResult02[0].SlidesInTray
                this.obApiResult03 = temp[3]
                this.strInTrayBlockCount = this.obApiResult03[0].BlockCountInTray

                this.rdSlideTrayBehaviorOptions[0].disabled = true
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
            this.strInputTextLabel = this.defaultstrInputTextLabel
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

      if (this.blFirstSlideScanned) {
        axios.post(store.getters.getApiUrl + '/slidedistribution', {
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
            this.currentslidetray = this.nextslidetray
            this.inputtext = 'Scan Slide Tray to Proceed'
            this.strInputTextLabel = this.defaultstrInputTextLabel
            this.slidedistid = null
            this.loading = false
            this.strInTrayBlockCount = '0'
            this.strInTraySlideCount = '0'
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
      axios.post(store.getters.getApiUrl + '/slidedistribution', {
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
            this.currentslidetray = this.nextslidetray
            this.inputtext = 'Scan Slide Tray to Proceed'
            this.strInputTextLabel = this.defaultstrInputTextLabel
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
      this.currentslidetray = this.nextslidetray
      this.inputtext = 'Scan Slide Tray to Proceed'
      this.strInputTextLabel = this.defaultstrInputTextLabel
      this.slidedistid = null
      this.loading = false
      this.strInTrayBlockCount = '0'
      this.strInTraySlideCount = '0'
      this.slides = {}
      this.SlideDistributionID = null
      this.rdSlideTrayBehaviorOptions[1].disabled = false
      this.rdSlideTrayBehaviorOptions[0].disabled = false
    }

},
computed: {}
}
</script>
