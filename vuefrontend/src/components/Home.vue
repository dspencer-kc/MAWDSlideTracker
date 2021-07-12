// Home.vue

<template>
  <div class="col d-flex justify-content-center" style="font: normal small-caps normal 30px/1.4 'Arial';">
    <b-card style="max-width: 500px;" header="Pre-Embedded" >
      <strong><b-progress height="4rem" class="mt-2" :max="this.preEmbedded" show-value>
        <b-progress-bar :value="this.preEmbedded" variant="primary"></b-progress-bar>
      </b-progress></strong>
    </b-card>
    <b-card style="max-width: 500px;" header="Embedded" >
      <strong><b-progress height="4rem" class="mt-2" :max="this.embedded" show-value>
        <b-progress-bar :value="this.embedded" variant="success"></b-progress-bar>
      </b-progress></strong>
    </b-card>
    <b-card style="max-width: 500px;" header="Slides Cut" >
      <strong><b-progress height="4rem" class="mt-2" :max="this.slidesCut" show-value>
        <b-progress-bar :value="this.slidesCut" variant="warning"></b-progress-bar>
      </b-progress></strong>
    </b-card>
    <b-card style="max-width: 500px;" header="Distributed" >
      <strong> <b-progress height="4rem" class="mt-2" :max="this.distributed" show-value>
        <b-progress-bar :value="this.distributed" variant="info"></b-progress-bar>
      </b-progress></strong>
    </b-card>
  </div>
</template>


<script>
import axios from 'axios'
import store from '../store.js'

export default {
  name: 'home', // component name
  data() {
    return {
      blockStatusData:'',
      preEmbedded:0,
      embedded:0,
      slidesCut:0,
      distributed:0,
      max:0
    }
  },
  mounted() {
    console.log('MOUNTED')
    this.LoadData()

  },
  methods: {
     LoadData(){
     axios.post(store.getters.getApiUrl + '/GetStatusData', {
       action: 'GetStatusData'
     })
         .then(apidata => {
           console.log("AXIOS RESPONSE")
           console.log(JSON.stringify(apidata))
           this.blockStatusData = apidata
           this.preEmbedded= apidata.data[0]['count']
           this.embedded= apidata.data[1]['count']
           this.slidesCut= apidata.data[2]['count']
           this.distributed= apidata.data[3]['count']
           this.max =this.preEmbedded+ this.embedded+ this.slidesCut+ this.distributed

         })


     }
  }
}
</script>
