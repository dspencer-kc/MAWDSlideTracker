<!-- ===========================================================================================

    File: Embedding.vue

    Authors: Justin Dial

    Description: This is the component for handling the embedding process
============================================================================================ -->
<template>
  <div class="container"  v-if="this.$store.getters.GetValidUser" >
  <h1>Scan Block</h1>
    <br>
  <b-card class="mx-auto" style="max-width: 68%;opacity:.90;font: normal small-caps normal 30px/1.4 'Arial';" >
    <b-card-text class="mb-5"></b-card-text>
    <b-card-text>
      <b-iconstack class="mb-5 py-md-1" :variant="SetColor">
        <b-icon stacked icon="calendar" scale="6" flip-v=true ></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="21"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="-21" shift-v="-21"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21"  shift-v="21"></b-icon>
        <b-icon stacked icon="grid3x3" scale="2.8" shift-h="21"  shift-v="-21"></b-icon>
      </b-iconstack>
    </b-card-text>
    <span v-if="this.blockID">
    <b-card-text>AccessionID:       <b-badge>{{this.blockData.data[0].SpecNumFormatted}}                                           </b-badge></b-card-text>
    <b-card-text>Block ID:          <b-badge> {{this.blockData.data[0].PartDesignator}}{{this.blockData.data[0].BlockDesignator}}  </b-badge></b-card-text>
    <b-card-text>Name:              <b-badge>{{this.blockData.data[0].PatientName}}                                                </b-badge></b-card-text>
    <b-card-text>BlockStatus:       <b-badge>{{this.blockData.data[0].BlockStatus}}                                                </b-badge></b-card-text>
    <b-card-text>BlockComment:      <b-badge>{{this.blockData.data[0].BlockComment}}                                               </b-badge></b-card-text>
    <b-card-text>PartDescription:   <b-badge>{{this.blockData.data[0].PartDescription}}                                            </b-badge></b-card-text>
    </span>
   </b-card>
  </div>
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
      blockData:[],
      SetColor:'secondary'
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
          console.log("SOCKET STREAM EMBED")
          this.validateScanData(data)
      }
  },
  methods: {
    validateScanData(data){
      if (store.state.validuser) {
        //Depending on prefix, send to correct placeholder
        console.log("EMBEDDED: "+this.$route.name)
        switch(data.barcodeScanData.substring(0,4)) {
          case 'HBLK':
            this.blockID = data.barcodeScanData
            if (this.$route.name =='Embedding'){this.getBlockData()};
            break
          default:
            // code block
        }
      } else {
        this.blockID = ''
      }

    },

     getBlockData() {
      axios.post(store.getters.getApiUrl + '/GetBlockData', {
      action: 'GetBlockData',
      blockID:this.blockID,
      curRoute : this.currentRouteName
      })
      .then(apidata => {
        this.blockData = apidata;
        this.setBlockColor(apidata.data[0].Hopper);
        this.setBlockData();
        }).catch((e) => {
        console.log("AXIOS ERROR: "+e)
        this.makeToast("Failed to get block: "+e, "Block Failure", "danger",10000)
        })
    },

    setBlockData() {
      axios.post(store.getters.getApiUrl + '/SetBlockData', {
      action: 'SetBlockData',
      blockData:this.blockData,
      scanlocation:store.state.stationName,
      userid:store.state.username,
      curRoute : this.currentRouteName
      })
      .then(apidata => {
        console.log("SET BLOCK DATA AXIOS CALL")
        console.log(this.currentRouteName())
        var ToastString = this.blockData.data[0].BlockID+" Status Updated to Embedded";
        this.makeToast(ToastString, "Block Status", "success",3000)
        }).catch((e) => {
          console.log("AXIOS ERROR: "+e)
          this.makeToast("Failed to Embed: "+e, "AXIOS ERROR", "danger",10000)
        })
    },
    setBlockColor(hopperColor){
        let colors = {
          101:'primary', //blue
          102:'primary', //blue
          103:'success', //green
          104:'success', //green
          105:'danger', //red
          106:'warning', //yellow
          107:'dark', //purple
          108:'dark'  //purple
        };
        if (colors[hopperColor]){this.SetColor = colors[hopperColor]}
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
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>
