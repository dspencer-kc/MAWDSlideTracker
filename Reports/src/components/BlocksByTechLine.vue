// BlocksByTechLine.vue

<template>
    <div>
    <h1>Blocks By Tech Line</h1>
    <line-chart :chart-data="ChartData" :width="5" :height="2"></line-chart>
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
  localdatacollection: null
}
},
mounted() {
  console.log('Hello component created')
  // this.SetChartData()
  // this.GetChartDataLocal()
},
methods: {
  // GetChartDataLocal (){
  //     console.log('Hello getchartdatalocal')
  //  store.dispatch('LoadChartDataWPromise').then(() => {
  //   console.log('Show after promise blah')
  //   this.localdatacollection = store.state.objChartDataCollection
  //   console.log('after store data')
  //  })   
  // },
},
computed: {
    ChartData() {
      return this.$store.getters.ChartDataCollection
    }
} 
}
</script>