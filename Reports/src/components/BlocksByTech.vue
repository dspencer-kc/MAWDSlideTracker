// BlocksByTech.vue

<template>
    <div>
    <h1>Blocks By Tech In Router</h1>
    <bar-chart :chart-data="localdatacollection" :width="5" :height="2"></bar-chart>
          From Date and Time:
      <input v-model="FromDateTime">
      <br>
      To Date and Time:
      <input v-model="ToDateTime">
      <br>
      <button @click="GetChartDataLocal">Refresh Data</button>

    <label> From Date and Time: </label>
    </div>
    
</template>

<script>
import store from '../store.js'
import BarChart from './BarChart2.js'

export default {
name: 'BlocksByTech',
data() {
return {
  localdatacollection: null
}
},
mounted() {
  console.log('Hello component created')
  // this.SetChartData()
  this.GetChartDataLocal()
},
methods: {
  GetChartDataLocal (){
      console.log('Hello getchartdatalocal')
   store.dispatch('LoadChartDataWPromise').then(() => {
    console.log('Show after promise blah')
    this.localdatacollection = store.state.objChartDataCollection
    console.log('after store data')
   })   
  },
},
computed: {
        FromDateTime: {
        get () {
            return this.$store.state.strFromDateTime
        },
        set (value) {
            this.$store.commit('SetFromDateTime', value)
        }
    },
        ToDateTime: {
        get () {
            return this.$store.state.strToDateTime
        },
        set (value) {
            this.$store.commit('SetToDateTime', value)
        }
    }
} 
}
</script>