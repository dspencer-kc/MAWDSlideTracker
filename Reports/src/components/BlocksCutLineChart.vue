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
  localdatacollection: {
    
    datasets: [{
      label: 'Blocks Cut',
      data: 
        [
          {
            t: new Date('2019-12-12 3:41'),
            y: 1
          }, 
          {
            t: new Date('2019-12-12 14:41'),
            y: 10
          }
        ],
    },
      {
        label: 'Slides Distributed',
      data: [{
    x: new Date('2019-12-12 4:41'),
    y: 1
}, {
    t: new Date('2019-12-12 16:41'),
    y: 5
}]
      
      }
      
    ]
  
  },
  localoptions:   {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: "Time Today's Blocks were Cut and Slides Marked Distributed to Couriers (count off of block)",
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'hour',
          tooltipFormat: 'lll',
        }
      }]
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