// Slide Distribution.vue

<template >
<div class="container" v-if="this.$store.getters.GetValidUser" >

  <b-navbar class="bg-dark navbar-expan" style="white-space: nowrap;">
    <b-nav-item  disabled ="navbar-brand"> <h3><b-badge :model="currentslidetray" :style="getInputColor(currentslidetray)">{{currentslidetray}}   </b-badge></h3></b-nav-item>
    <b-nav-item>Slide Count:<h3><b-badge>{{strInTraySlideCount}} </b-badge></h3></b-nav-item>
    <b-nav-item>Block Count:<h3><b-badge>{{strInTrayBlockCount}} </b-badge></h3></b-nav-item>
    <b-button><span>{{formstatuslabel}}</span></b-button>
    <b-button @click="Cancel()"><span>Cancel</span></b-button>
    <b-nav-item class="navbar-brand"></b-nav-item>
    <b-nav-item class='ml-auto'>
      <b-form-radio-group  id="rdSlideTrayBehavior" v-model="rdSlideTrayBehaviorSelected" :options="rdSlideTrayBehaviorOptions" buttons name="radios-btn-default">
      </b-form-radio-group>
    </b-nav-item>

  </b-navbar>
  <br>
  <div class='col-xs-6'>
    <b-table v-if="this.slides.length>0" style="opacity: .90;white-space: nowrap;" striped hover dark small borderless :items="slides" :fields="fields" ></b-table>
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
  fields: {},
  obApiResult02: {},
  obApiResult03: {},
  strInTrayBlockCount: '0',
  strInTraySlideCount: '0',
  rdSlideTrayBehaviorSelected: 'NewSlideTray',
  rdSlideTrayBehaviorOptions: [
    { text: 'New', value: 'NewSlideTray', disabled: false },
    { text: 'Edit', value: 'EditExisting', disabled: false },
  ]
}
},
mounted() {
  this.LoadTableData()
},
  sockets: {
      connect: function () {
          //console.log('socket connected within slide')
      },
      customEmit: function (data) {
          //console.log(' within slide this method was fired by the socket server. eg: io.emit("customEmit", data)')
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

      axios.post(store.getters.getApiUrl + '/slideDistribution', {
      action: 'MarkSlideToBeDistributed',
      slidedistid: strSlideDistributionID,
        slidetray: this.slidetrayID,
      slideid: strSlideID,
      curRoute : this.currentRouteName
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
        this.slides = temp[1]
        this.fields = Object.keys(this.slides[0])
        this.fields[3] = { key: Object.keys(this.slides[0])[3], label: 'Case Slides Not In Tray' }
        this.obApiResult02 = temp[2]
        this.strInTraySlideCount = this.obApiResult02[0].SlidesInTray
        this.obApiResult03 = temp[3]
        this.strInTrayBlockCount = this.obApiResult03[0].BlockCountInTray
        // Update block count table
        this.LoadTableData()

      }).catch((e) => {
        //console.log(e)
      })
      .catch(function (error) {
        //console.log("error:")
        //console.log(error)
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
          axios.post(store.getters.getApiUrl + '/slideDistribution', {
          action: 'CreateNewSlideDistribution',
          userid: store.state.username,
          slidetray: this.slidetrayID,
          scanlocation: store.state.stationName,
          curRoute : this.currentRouteName
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
            //console.log(e)
          })
          .catch(function (error) {
            //console.log("error:")
            //console.log(error)
          })
          break
      }
    },
    getInputColor (text) {
        if(text != this.defaultcurrentslidetray && text != this.nextslidetray) return  {'background-color': '#28a745'} ;
        if(text == this.defaultcurrentslidetray ||  text == this.nextslidetray) return  {'background-color': '#dc3545'} ;
},
    ScanSlideTray(strSlideTrayID){
        if (this.blSlideTrayLoaded === false) {
            this.blSlideTrayLoaded = true
            this.slidetrayID = strSlideTrayID
            this.currentslidetray = this.slidetrayID

            if (this.rdSlideTrayBehaviorSelected === 'EditExisting') {

              // Get slidedistr id from slide tray and load slides
              this.loading = 'true'
              axios.post(store.getters.getApiUrl + '/slideDistribution', {
              action: 'LoadSlideTray',
              userid: store.state.username,
              slidetray: this.slidetrayID,
              scanlocation: store.state.stationName,
              curRoute : this.currentRouteName
              })
              .then(apidata => {
                this.loading = false;
                this.error_message = '';
                if (apidata.errorcode) {
                  this.error_message = `Error loading existing slide distr.`
                  //console.log('error')
                  return
                }
                let temp = apidata.data


                this.SlideDistributionID = temp[0][0].CurrentSlideDistID
                //Load Slide Tray now
                this.slides = temp[1]
                this.fields = Object.keys(this.slides[0])
                this.fields[3] = { key: Object.keys(this.slides[0])[3], label: 'Case Slides Not In Tray' }
                this.fields[3] = "Case Slides Not In Tray"
                this.obApiResult02 = temp[2]
                this.strInTraySlideCount = this.obApiResult02[0].SlidesInTray
                this.obApiResult03 = temp[3]
                this.strInTrayBlockCount = this.obApiResult03[0].BlockCountInTray

                this.rdSlideTrayBehaviorOptions[0].disabled = true
                //this.LoadTableData()


              }).catch((e) => {
                //console.log(e)
              })
              .catch(function (error) {
                //console.log("error:")
                //console.log(error)
              })

            } else {
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
        axios.post(store.getters.getApiUrl + '/slideDistribution', {
        action: 'MarkSlidesReadyForCourier',
        slidedistid: this.SlideDistributionID,
        userid: store.state.username,
        slidedistrloc: strLocID,
        scanlocation: store.state.stationName,
        curRoute : this.currentRouteName
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
      axios.post(store.getters.getApiUrl + '/slideDistribution', {
        action: 'AssignTrayNewLocation',
        userid: store.state.username,
        slidedistrloc: strLocID,
        scanlocation: store.state.stationName,
        slidetray: this.slidetrayID,
        curRoute : this.currentRouteName
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
computed: {
  currentRouteName() {
    return this.$route.name;
  }
}
}
</script>
