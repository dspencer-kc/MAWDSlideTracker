// BCStackedBarAndPie.vue

<template>
    <div>
    <h1>Block Count Charts</h1>
    <bar-chart :chart-data="objFourRunBarData" :options="localoptions" :width="5" :height="2"></bar-chart>
    <pie-chart 
      v-if='loaded'
      :chart-data="objAllRunData" 
      :options="objTotalRunOptions" 
      :width="6" 
      :height="2"
    />


    </div>
    
</template>

<script>
import store from '../store.js'
import BarChart from './BarChart.js'
import PieChart from './PieChart.js'

export default {
name: 'BlockCountCharts',
components: {
  BarChart,
  PieChart
},
data() {
return {
  objFourRunBarData: null,
  localoptions: {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    },
    legend: {
      display: true,
      position: 'bottom'
    }
  },
  objTotalRunOptions: {
      title: {
        display: true,
        text: 'All Runs',
    },
    legend: {
      display: false,
      position: 'bottom'
    }
  },
  objAllRunData: null,
  loaded: false
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
    this.objFourRunBarData = store.state.objBarChartFourRuns
    this.objAllRunData = store.state.objPieChartTotalData
    console.log(store.state.objChartDataCollection)
    this.loaded=true
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