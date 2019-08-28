// Block Count All.vue

<template>
    <div>
    <h1>Block Count All</h1>
    <bar-chart :chart-data="datacollection" :width="5" :height="2"></bar-chart>
    </div>
    
</template>

<script>
import store from '../store.js'
import BarChart from './BarChart.js'

export default {
name: 'BlockCount',
components: {
  BarChart
},
data() {
return {
  datacollection: null
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
    ChartData() {
      this.localdatacollection
    }
} 
}
</script>