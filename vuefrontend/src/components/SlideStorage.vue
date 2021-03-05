<!-- ===========================================================================================

    File: SlideStorage.vue (copied from SlidesV3.vue)

    Authors: Drew Spencer

    Description: 

    Notes: Working towards StandardJS.
============================================================================================ -->
<template>


<div class="container">
  <div class="mx-auto">

<!--Scan Block......................-->
    <b-form v-on:submit.prevent="pullOrRequestSlides()" inline>
    <div class="customheadertext">
        <h3>Case No:  </h3>
    </div>
      <b-input id="InputAccID" class="mb-2 mr-sm-2 mb-sm-0" v-model="accID" :disabled=inputTextBoxDisabled placeholder="ie: DXX-XXXXX" />
      <b-button type="submit" variant="primary lg">{{formstatuslabel}}</b-button>
      <!--<b-button type="submit" variant="primary lg" :disabled=inputButtonDisabled>{{formstatuslabel}}</b-button>-->
      <!--<b-button id="btnManualBlockIDToggle" :disabled=inputNoBarcodeButtonDisabled v-b-toggle.collapse-manualbockid variant="outline-secondary"> No Barcode </b-button-->
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
    <h5>{{formtextlabel}} {{ slides.length }}</h5>
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
                      <br>

                      </div>
                                          

                      <div class=slidefooter>
                     Location Status:
                     <br>
                      {{ result.slidestoragestatus}}

                      </div>
            </div> <!-- /Slidelabel -->
              <p>
                Request  Slide 
                <input type="checkbox"
                v-model=result.ToBeRequested
                >
                <br><br>
                Current Slide Owner:
                <br>
                  {{ result.slideowner}}<br><br>
                  Location:
                  <br>
                      {{ result.slidelocationid}}
                  <br>
                  Most Recent Update:
                  {{ result.updateddatetime}}
                  
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
import gql from 'graphql-tag'

export default {
  name: 'slidestorage', // component name 
  props: {
    // username: String,  access through store
    // firstname: String,
    lastname: String,
    userid: String,
    // background: String,
    // validuser: Boolean access through store
    //blockID: String
    },
    data() {
    return {
      accID: '',
      error_message: '',
      loading: false, // to track when app is retrieving data
      slides: {},
      rarsslides: {},
      formstatus: 'loadslides',
      formstatuslabel: 'Check Slide Availability',
      info: null,
      formtextlabel: '',
      static_slide_name: 'KL20-11898_A_3.3.1'
    }
  },


/*
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
  },*/
  methods: {
    /*validateScanData(data){
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
            //BlockScan Detected Pull Slides
            this.blockID = data.barcodeScanData
            //this.pullSlidesViaPost();
            this.pullSlides();
            break
          case 'SBDG':
          //Handled within App.vue
          //this.scannedbadgeinput = data.barcodeScanData
          //this.scanbadge()
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

    },*/
    pullOrRequestSlides()
    {

      if (this.formstatus == 'loadslides') {
        this.pullSlides();
      }
    else if (this.formstatus === 'readytorequest') {
      console.log('goto request slides');
      this.requestSlides()
    }{

    }

  },

    pullSlides() {
          this.getSlideArchiveStatus(this.accID)
          
           console.log('start pull slides revised for slide storage');
      //this.GetPartBlockCurrentAndTotals()
      let accID = this.accID
      if (!accID) {
        alert('please enter block ID to pull up slides')
        return
      }
      this.loading = true

      //Axios Template
      axios.post(store.state.apiURL + '/slidestorage', {
        accessionid: accID,
        userid: store.state.username
        })
        .then(apidata => {
          console.log(apidata)
          
          let temp = {}
                temp = apidata.data
          console.log('temp:')
          console.log(temp)
          this.slides = temp;
          this.formstatus = 'readytorequest';
          // document.getElementById("InputaccID").disabled = true;
          this.formstatuslabel = 'Request Slides';
          this.formtextlabel = "Slides on this Case:"
          console.log("Made it to this.slide=data");
          this.loading = false
          //console.log(data);
        })
        .catch((error) => {
            console.log(error)
            this.error_message = ''
            this.loading = false
            this.error_message = `Sorry, no case found with Case No '${accID}' not found.`
            console.log('error')
        })
      /*
      //uses fetch as opposed to Axios
      fetch(buildUrl(accID))
        //.then(response => response.json())
        .then(function(response){
          return response.json()
        })
        .then(data => {
          this.loading = false
          this.error_message = ''
          if (data.errorcode) {
            this.error_message = `Sorry, no case found with Case No '${accID}' not found.`
            console.log('error')
            return
          }

          this.slides = data;
          this.formstatus = 'readytoprint';
          document.getElementById("InputaccID").disabled = true;
          this.formstatuslabel = 'Print Slides';
          console.log("Made it to this.slide=data");
          console.log(data);
        }).catch((e) => {
          console.log(e)
        })
        */
        // this.GetPartBlockCurrentAndTotals()
    },
    requestSlides() {
    console.log('Hello requestSlides')

    // For each slide, submit graphql request
    var i;
    for (i = 0; i < this.slides.length; i++) {
      if (this.slides[i].ToBeRequested) {
        // Put in logic to send to apollo here
        console.log('Slide ',i,'requested')
        this.submitSlideRequest(this.slides[i].SlideID, 'TestUserName', Date.now())

      }
    }
        this.formstatuslabel = "Check Slide Availability"
    this.formtextlabel = "Slide Request Has Been Submitted."
    // Need to wait until submitted to clear.
    // this.clearCurrentSlide()
    },
    updateSlideToPrintValue(strSlideID, blChecked)
    {
            //Send api the following:  action: UpdateSlideToPrint slideid=? value=?
      axios.post(store.state.apiURL + '/updateslidetoprint', {
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
    GetPartBlockCurrentAndTotals() {
        console.log('start GetPartBlockCurrentAndTotals')
              axios.post(store.state.apiURL + '/getpartblockcurrentandtotals', {
              accID: this.accID
            })
            .then(apidata => {
              this.loading = false;
              this.error_message = '';
              if (apidata.errorcode) {
                this.error_message = `Error looking up badge.`
                console.log('error')
                return
              }
              console.log('apidata:', apidata);
              let temp = {}
              temp = apidata.data
              console.log(temp)
              this.totalBlocks = temp.totalblocks
              this.totalParts = temp.totalparts


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
      this.accID =""
      this.formstatus = 'loadslides'
      this.formstatuslabel = 'Check Slide Availability'
      this.totalBlocks = ''
      this.totalParts = ''
      //Always disable input textbox now that we're scanning
      //document.getElementById("InputaccID").disabled = false;
      this.slides = {}
      this.setFocusToInputAccID()
    },
    setFocusToInputAccID(){
      document.getElementById("InputAccID").focus();
    },
    getSlideArchiveStatus(accessionid) {
      console.log('start get static')
      this.$apollo.query({
        query: gql`query getslidesbycase($accessionid: String!) {
          slides(where: {accessionid: {_eq: $accessionid}}) {
            slideid
            accessionid
            blockid
            box_id
            casetype
            location
            requestedby
            requestts
            retrievalrequest
            sitelabel
            stain
            stainorderdate
            ts
            year
          }
        }`,

        variables: {
          accessionid
        }
      }).then((response) => {
        console.log('Graphql  response:')
        console.log(response)
        this.rarsslides = response.data.slides
      })
    },
      submitSlideRequest(slide, strRequestedBy, varTimeStamp) {
      console.log('SubmitSlideRequestStart',slide)
      this.$apollo.mutate({
        mutation: gql`mutation UpdateRetrievalRequest($slide: String!, $strRequestedBy: String!, $varTimeStamp: Float) {
          update_slides_by_pk(
          pk_columns: {slideid: $slide}, 
          _set: {retrievalrequest: true, requestedby: $strRequestedBy, requestts: ${varTimeStamp}})
          {
          slideid
          requestedby
          retrievalrequest
          requestts
          }
        }
        `,
        variables: {
          slide,
          strRequestedBy,
          varTimeStamp
        }
      }).then((response) => {
        console.log('Slide Submitted')
        console.log(response)
      })
    },
  },

  computed:{
    inputButtonDisabled(){
      if (store.state.validuser && this.accID) {
        return false;
      } else {
        return true;
      }
    },
    inputTextBoxDisabled(){
      //if (this.validuser=='f' || !accID ) {
      //if (this.validuser) {
      //  return false;
      //} else {
      //  return true;
      //}
      //manual input of case number
      return false
    },
    inputNoBarcodeButtonDisabled(){
      //if (this.validuser=='f' || !accID ) {
      if (store.state.validuser && !this.accID) {
        return false
      } else {
        return true
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
