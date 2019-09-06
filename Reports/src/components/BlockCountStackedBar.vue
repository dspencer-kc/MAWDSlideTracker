// BlockCountStackedBar.vue

<template>
    <div>
    <h1>Block Count Stacked Bar</h1>
    <bar-chart :chart-data="datacollection" :options="localoptions" :width="5" :height="2"></bar-chart>
    </div>
    
</template>

<script>
import store from '../store.js'
import BarChart from './BarChart.js'

export default {
name: 'BlockCountStackedBar',
components: {
  BarChart
},
data() {
return {
  datacollection: null,
  localoptions: {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    }
  }
}
},
mounted() {
  console.log('Hello component created')
  this.GetChartData()
},
methods: {
  GetChartData (){
   store.dispatch('LoadPathConBlockCount').then(() => {
    //    store.dispatch('LoadBlockCountTableData').then(() => {
    console.log('Promise completed')
    this.datacollection = store.state.objChartDataCollection
    console.log(store.state.objChartDataCollection)
   })   
  },
},
computed: {
  //  ChartData() {
  //    this.localdatacollection
  //  }
} 
}
</script>