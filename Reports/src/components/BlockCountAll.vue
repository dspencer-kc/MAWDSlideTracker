// Block Count All.vue

<template>
    <div>
    <h1>Block Count All</h1>
    <bar-chart :chart-data="localdatacollection" :width="5" :height="2"></bar-chart>
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
  datacollection: null,
  localdatacollection: {
      labels: ['1st Run', '2nd Run', '3rd Run', '4th Run', 'Total'],
      datasets: [
        {
          label: 'AES',
          data: [55,95,0,23,150],
          backgroundColor: '#003f5c',
        },
        {
          label: 'JAK',
          data: [23,0,15,35,100],
          backgroundColor: '#58508d',
        },
        {
          label: 'SLL',
          data: [55,23,23,15,75],
          backgroundColor: '#ffa600',
        }
      ]
  ,
  options: {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }]
    }
  }
}
}
},
mounted() {
  console.log('Hello component created')
  // this.SetChartData()
  // this.GetChartData()
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