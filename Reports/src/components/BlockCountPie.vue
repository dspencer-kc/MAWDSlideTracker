// BlockCountPie.vue

<template>
    <div>
    <h1>Block Count Pie</h1>
    <pie-chart :chart-data="datacollection" :options="localoptions" :width="5" :height="2"></pie-chart>
    </div>
    
</template>

<script>
import store from '../store.js'
import PieChart from './PieChart.js'

export default {
name: 'BlockCountPie',
components: {
  PieChart
},
data() {
return {
  datacollection: {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [        
      '#41B883',
      '#E46651',
      '#00D8FF'
      ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Red',
      'Yellow',
      'Blue'
    ]
},
}
},
mounted() {
  console.log('Hello component created')
//  this.GetChartData()
},
methods: {
/*  GetChartData (){
   store.dispatch('LoadPathConBlockCount').then(() => {
    //    store.dispatch('LoadBlockCountTableData').then(() => {
    console.log('Promise completed')
    this.datacollection = store.state.objChartDataCollection
    console.log(store.state.objChartDataCollection)
   })   
  },*/
},
computed: {
  /*  ChartData() {
      this.localdatacollection
    } */
} 
}
</script>