// Home.vue

<template>
  <div class="col d-flex justify-content-center" style="font: normal small-caps normal 30px/1.4 'Arial';">
    <b-card style="min-width: 80%;" header="Slide Status" >
    <b-progress class="mt-2" :max="100" show-value height="4rem">
      <b-progress-bar :value="25" variant="primary"><span>preEmbedded: <h4>{{ preEmbedded }} </h4></span></b-progress-bar>
      <b-progress-bar :value="25" variant="success"><span>embedded: <h4>{{ embedded }}</h4></span></b-progress-bar>
      <b-progress-bar :value="25" variant="warning"><span>slidesCut: <h4>{{ slidesCut}} </h4></span></b-progress-bar>
      <b-progress-bar :value="25" variant="info"><span>distributed: <h4>{{ distributed }} </h4></span></b-progress-bar>
    </b-progress>
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
           this.preEmbedded = apidata.data[0]['count']
           this.embedded    = apidata.data[1]['count']
           this.slidesCut   = apidata.data[2]['count']
           this.distributed = apidata.data[3]['count']
           this.max = this.preEmbedded+ this.embedded+ this.slidesCut+ this.distributed

         })


     }
  }
}
</script>
