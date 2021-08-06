// Home.vue

<template>
  <div class="container">
    <h1>Slide Status</h1>
    <br>
    <b-progress class="mx-auto" :max="max" show-value height="4rem" style="border:2px solid #000;max-width: 80%">
      <b-progress-bar :value="preEmbedded" variant="primary"><span>Pre Embedded: <h3>{{ preEmbedded }}</h3></span> </b-progress-bar>
      <b-progress-bar :value="embedded" variant="success" v-if="embedded>=(slidesCut/12)"><span>Embedded:     <h3>{{ embedded }}</h3></span></b-progress-bar>
      <b-progress-bar :value="embedded*12" variant="secondary" v-if="embedded<(slidesCut/12)"><span>Embedded:     <h3>{{ embedded }}</h3></span></b-progress-bar>
      <b-progress-bar :value="slidesCut" variant="warning"><span>Slides Cut: <h3>{{ slidesCut}}</h3> </span></b-progress-bar>
      <b-progress-bar :value="distributed" variant="danger"><span>Distributed: <h3>{{ distributed }}</h3></span></b-progress-bar>
    </b-progress>
    <i>Updated At: {{timestamp}}</i>
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
      max:0,
      timestamp:0
    }
  },
  mounted() {
    this.LoadData()

  },
  methods: {
     LoadData(){
     axios.post(store.getters.getApiUrl + '/GetStatusData', {
       action: 'GetStatusData',
       curRoute : this.currentRouteName
     })
         .then(apidata => {
           this.blockStatusData = apidata
           this.timestamp = new Date(apidata.data[0].timestamp).toLocaleString().split(',')[1]
           this.preEmbedded = apidata.data[0]['count']
           this.embedded    = apidata.data[1]['count']
           this.slidesCut   = apidata.data[2]['count']
           this.distributed = apidata.data[3]['count']
           this.max = this.preEmbedded+ this.embedded+ this.slidesCut+ this.distributed

         })


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
