<!-- ===========================================================================================

    File: CaseInquiry.vue

    Authors: Justin Dial

    Description: This is the component for handling Case Querying
============================================================================================ -->

<template>
  <div class="justify-content-center container"  >
    <h1>Case Inquiry</h1>

    <b-checkbox v-model="exactMatch">Exact Match</b-checkbox>
    <b-input-group style="max-width: 43%;" class="mx-auto" >
      <b-input id="InputCaseNo"  v-model="strCaseNo" placeholder="Input Case No: ie D19-99999" @keyup.enter="EnterKeyTrigger" />
      <b-button type="submit" variant="primary sm" @click="LoadTableData()" ref="btnLoadTableData">OK</b-button>
    </b-input-group>
    <br>
    <b-table style="opacity: .90;font-size: smaller;" striped hover dark small borderless :items="queryData" :fields="fieldVals"></b-table>
    </div>
</template>
<script>

import axios from 'axios'
import store from '../store.js'

export default {
  name: 'CaseInquiry',
  data() {
    return {
      strCaseNo: 'D19-99999',
      fieldVals: [],
      exactMatch: true,
      queryData: []
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
      data = data['barcodeScanData']
      this.strCaseNo = data.split('_')[0].substr(4)
      this.LoadTableData()
    }
  },
  methods: {
    LoadTableData() {
      let strFullAPICall = store.getters.getApiUrl + '/GetCaseInquery'
      var accId = ''
      if(!this.exactMatch){accId="%"+this.strCaseNo+"%"}
      else{accId=this.strCaseNo}
      axios.post(strFullAPICall, {
        ACCESSIONID: accId,
        apitoken: store.state.apitoken,
        curRoute : this.currentRouteName
      })
          .then(apidata => {
            let temp = {}
            temp = apidata.data
            console.log(JSON.stringify(apidata))
            for (let e of temp) {
              if(e['Order Time'])         e['Order Time'] =         this.dateFormatter(e['Order Time']);
              if(e['Embedded Time'])      e['Embedded Time'] =      this.dateFormatter(e['Embedded Time']);
              if(e['Slide Printed Time']) e['Slide Printed Time'] = this.dateFormatter(e['Slide Printed Time']);
              if(e['StainOrderDate'])     e['StainOrderDate'] =     this.dateFormatter(e['StainOrderDate']);
              if(e['DTReadyForCourier'])  e['DTReadyForCourier'] =  this.dateFormatter(e['DTReadyForCourier']);
              if(e['DateTimeEngraved'])   e['DateTimeEngraved'] =   this.dateFormatter(e['DateTimeEngraved']);
            }
            this.queryData = temp
            this.fieldVals = Object.keys(this.queryData[0])
          }).catch((e) => {
        console.log(e)
      })
          .catch(function (error) {
            console.log("error:")
            console.log(error)
          })
    },
    dateFormatter(str){
      return str.replace('T', ' ').replace('Z', ' ').split('.')[0].substring(2,99)
    },
    EnterKeyTrigger() {
      this.$refs.btnLoadTableData.click()
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
  mounted() {
  },
  computed:{
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>