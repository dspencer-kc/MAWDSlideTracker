<!-- ===========================================================================================

    File: Embedding.vue

    Authors: Justin Dial

    Description: This is the component for handling the embedding process
============================================================================================ -->
<template>

<div class="container" v-if="this.$store.getters.GetValidUser" >
<br>
<b-card class="mx-auto " style="max-width: 340px;" header="Scan Block" v-if="!this.blockID">
  <b-card-text class="mb-5"></b-card-text>
  <b-card-text>
    <b-iconstack class="mb-5">
    <b-icon stacked icon="calendar" scale="6" flip-v=true                   variant="dark"></b-icon>
    <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="21"  variant="dark"></b-icon>
    <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="-21" variant="dark"></b-icon>
    <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21" shift-v="21"   variant="dark"></b-icon>
    <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21" shift-v="-21"  variant="dark"></b-icon>
    </b-iconstack>
  </b-card-text>
   </b-card>
  <b-card class="mx-auto" style="max-width: 340px;" header="Block Info" v-if="this.blockID">
    <b-card-text class="mb-5"></b-card-text>
    <b-card-text>
      <b-iconstack class="mb-5">
        <b-icon stacked icon="calendar" scale="6" flip-v=true                   :style="getBlockColor()"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="21"  :style="getBlockColor()"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="-21" :style="getBlockColor()"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21" shift-v="21"   :style="getBlockColor()"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21" shift-v="-21"  :style="getBlockColor()"></b-icon>
      </b-iconstack>
    </b-card-text>

    <b-card-text>AccessionID:      <b-badge>{{this.blockData.data[0].SpecNumFormatted}}                                           </b-badge></b-card-text>
    <b-card-text>Block ID:         <b-badge> {{this.blockData.data[0].PartDesignator}}{{this.blockData.data[0].BlockDesignator}}  </b-badge></b-card-text>
    <b-card-text>Name:             <b-badge>{{this.blockData.data[0].PatientName}}                                                </b-badge></b-card-text>
    <b-card-text>BlockStatus:      <b-badge>{{this.blockData.data[0].BlockStatus}}                                                </b-badge></b-card-text>
    <b-card-text>BlockComment:     <b-badge>{{this.blockData.data[0].BlockComment}}                                               </b-badge></b-card-text>
    <b-card-text>PartDescription:  <b-badge>{{this.blockData.data[0].PartDescription}}                                            </b-badge></b-card-text>


   </b-card>
  </div>
<!-- /container -->
</template>


<!--components/Slides.vue -->
<script>
import axios from 'axios'
import store from '../store.js'

export default {
  name: 'embedding', // component name
    data() {
    return {
      blockID: '',
      blockData:[]
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
          console.log('socket on within slide')
          console.log('within slide:',data)
          //validate scan data
          this.validateScanData(data)
      }
  },
  methods: {
    validateScanData(data){
      if (store.state.validuser) {
        //Depending on prefix, send to correct placeholder
        console.log('slide: barcodescan', data.barcodeScanData)
        console.log('slide: prefix', data.barcodeScanData.substring(0,4))

        switch(data.barcodeScanData.substring(0,4)) {
          case 'HBLK':
            console.log(data.barcodeScanData)
            this.blockID = data.barcodeScanData
            this.getBlockData();
            break
          default:
            // code block
        }
      } else {
        this.blockID = ''
      }

    },

    async getBlockData() {
      console.log('start pull block');
      this.loading = true
      console.log(this.blockID);
      axios.post(store.getters.getApiUrl + '/GetBlockData', {
      action: 'GetBlockData',
      blockID:this.blockID
      })
      .then(apidata => {
        console.log('pull block response');
        this.loading = false;
        console.log(apidata);
        this.blockData = apidata;
        console.log(this.blockData)
        this.setBlockData();
        }).catch((e) => {
          console.log("AXIOS ERROR: "+e)
        })
    },

    setBlockData() {
      console.log('start update block');
      console.log(this.blockData);
      axios.post(store.getters.getApiUrl + '/SetBlockData', {
      action: 'SetBlockData',
      blockData:this.blockData,
      scanlocation:store.state.stationName,
      userid:store.state.username
      })
      .then(apidata => {
        console.log('update block response');
        var ToastString = this.blockData.data[0].BlockID+" Status Updated to Embedded";
        this.makeToast(ToastString, "Block Status", "success")
        }).catch((e) => {
          console.log("AXIOS ERROR: "+e)
        })
    },
    getBlockColor(){
      if (this.blockData){
        var colorNum = this.blockData.data[0].Hopper
        let colors = {
          101:'#789af0', //blue
          102:'#789af0', //blue
          103:'#bddaac', //green
          104:'#bddaac', //green
          105:'#daacbd', //red
          106:'#dbce95', //yellow
          107:'#c9acda', //purple
          108:'#c9acda'  //purple
        };
        let blank = '#bddaac'; //grey
        console.log(colorNum)
        console.log(colors[colorNum])
        if (colors[colorNum]){
            return {'color':  colors[colorNum]}
        }
        return {'color':  blank}
      }
    },
    makeToast(content, title, variant = null) {
        this.$bvToast.toast(content, {
            title: title,
            variant: variant,
            solid: true,
            autoHideDelay: 4000,
            toaster: "b-toaster-bottom-right"
        })
    }
  },
  computed:{
  }
}
</script>
