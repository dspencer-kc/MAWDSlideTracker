// BlocksCutLineChart.vue

<template>
    <div>
    <h1>Blocks Cut</h1>
    <line-chart :chart-data="ChartData" :options="localoptions" :width="5" :height="2"></line-chart>
    </div>
    
</template>

<script>
import store from '../store.js'
import LineChart from './LineChart.js'

export default {
name: 'BlocksByTechLine',
components: {
  LineChart
},
data() {
return {
  localdatacollection: null,
  localoptions:   {
    /*scales:   {
    xAxes: [{
      type: "time",
      time: {
        unit: 'hour',
        unitStepSize: 0.5,
        tooltipFormat: "h:mm:ss a",
        displayFormats: {
          hour: 'MMM D, h:mm A'
        }
      }
    }],
    },*/
    legend: {
      display: false,
      position: 'bottom'
    }
    }
}
},
mounted() {
  console.log('Hello component created')
  // this.SetChartData()
  this.GetChartData()
},
methods: {
 GetChartData (){
   this.loaded = false
   store.dispatch('LoadBlockCutsLine').then(() => {
    console.log('LoadBlockCutsLine completed')
    // this.objAllRunData = store.state.objPieChartTotalData
    this.loaded=true
    
   })   
  }
},
computed: {
    ChartData() {
      return this.$store.getters.ChartDataCollection
    }
} 
}
</script>