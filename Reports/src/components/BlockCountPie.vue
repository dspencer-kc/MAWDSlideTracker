// BlockCountPie.vue

<template>
    <div>
    <h1>Block Count Pie</h1>
    <pie-chart 
    v-if='loaded'
    :chart-data="localdatacollection" 
    :options="localoptions" 
    :width="5" 
    :height="2"/>
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
    loaded: false,
    localdatacollection: null
    // Sample Data
    /* {
    datasets: [{
        data: [,33,,,22,29,,,21,,,,3,,,,,,,,,],
        backgroundColor: [        
      'rgb(70, 54, 153)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)',
      'rgb(75, 81, 211)'
      ]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'TBD',
      'AES',
      'BJC',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH',
      'DAH'
    ]
    }*/,
  localoptions: {
  }
}
},
mounted() {
  console.log('Hello component created')
  this.GetChartData()
},
methods: {
 GetChartData (){
   this.loaded = false
   store.dispatch('LoadPathConBlockCount').then(() => {
    console.log('Promise completed')
    this.localdatacollection = store.state.objPieChartFirstRunData
    console.log(store.state.objPieChartFirstRunData)
    console.log(this.localdatacollection)
    this.loaded=true
    
   })   
  },
},
computed: {
    
} 
}
</script>