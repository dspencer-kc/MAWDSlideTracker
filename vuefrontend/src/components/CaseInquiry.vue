<template>
  <div class="col d-flex justify-content-center" v-if="this.$store.getters.GetValidUser" >
      <div>
        <div><!--width is set by this div -->
          <h2 class="display-2">Case Inquery</h2>
          <div class="input-group">
            <b-input id="InputCaseNo"  v-model="strCaseNo" placeholder="Input Case No: ie D19-99999" @keyup.enter="EnterKeyTrigger" />
            <b-button type="submit" variant="primary sm" @click="LoadTableData()" ref="btnLoadTableData">OK</b-button>
          </div>
          <br>
          <b-table style="opacity: .95;background: grey" striped hover :items="queryData" :fields="arTblFields"></b-table>
        </div>
    </div>
      <br>
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
      arTblFields: [],
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
      let strFullAPICall = store.getters.getApiUrl + '/caseinquiry'
      axios.post(strFullAPICall, {
        ACCESSIONID: this.strCaseNo,
        apitoken: store.state.apitoken
      })
          .then(apidata => {
            if (apidata.errorcode) {
              console.log('error')
              return
            }
            let temp = {}
            temp = apidata.data
            console.log(JSON.stringify(apidata))
            this.queryData = apidata.data
            this.arTblFields = Object.keys(this.queryData[0])
          }).catch((e) => {
        console.log(e)
      })
          .catch(function (error) {
            console.log("error:")
            console.log(error)
          })
    },
    EnterKeyTrigger() {
      this.$refs.btnLoadTableData.click()
    }
  },
  mounted() {
  }
}
</script>