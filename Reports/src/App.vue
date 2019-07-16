<template>
  <div id="app">

    <h1>Blocks By Tech</h1>
    <bar-chart :chart-data="datacollection":width="5" :height="2"></bar-chart>
      From Date and Time:
      <input v-model="strFromDateTime">
      <br>
      To Date and Time:
      <input v-model="strToDateTime">
      <br>
      <button @click="LoadHistoData">Refresh Data</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import BarChart from './components/BarChart.js'
import LineChart from './components/LineChart.js'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    HelloWorld,
    BarChart
  },
data() {
return {
  arChartData: [],
  arChartLabels: [],
  strTest: 'hi',
  datacollection: null,
  strFromDateTime: '2019-07-11 22:00',
  strToDateTime: '2019-07-14 22:00'
}
},  
mounted () {
    this.LoadHistoData()
  },
methods: {
  LoadHistoData(){
    console.log('Hello LoadHistoData')
    console.log(this.strTest)
        this.arChartLabels = []
        this.arChartData = []

    // Need to assign this to an object so it can be referenced within Axios call
    let vue = this
      axios.post('http://10.24.4.9:2082/histodata', {
        fromdatetime: this.strFromDateTime,
        todatetime: this.strToDateTime
      })
    .then(function (response) {
      console.log(response)
      for(var i = 0; i < response.data.length; i++) {
        let strWhoPrinted = ''

        if (response.data[i].WhoPrinted === null) {
          strWhoPrinted = 'Unknown'
        } else {
          strWhoPrinted = response.data[i].WhoPrinted
        }  

        // Build Chart Data Array
        vue.arChartLabels.push(strWhoPrinted)
        vue.arChartData.push(response.data[i].CountOfBlockID)
     } // end for

        vue.datacollection = {
                  labels: vue.arChartLabels,
        datasets: [
          {
            label: 'Blocks Cut',
            backgroundColor: '#f87979',
            data: vue.arChartData
          }
        ]

        }


      console.log('done test')
    })
    .catch(function (error) {
      console.log(error)
    })
    console.log('done')
  },
}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
