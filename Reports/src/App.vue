<template>
  <div id="app">
      <nav>
        <router-link to='/'>Home</router-link> 
        <router-link to='/blocksbytech'>Blocks By Tech </router-link> 
        <router-link to='/login'>Login </router-link> 
        <router-link :to="{name: 'Profile', params: { msg } }">Go to your profile</router-link>
    </nav>
    <router-view></router-view>

      From Date and Time:
      <input v-model="FromDateTime">
      <br>
      To Date and Time:
      <input v-model="ToDateTime">
      <br>
      <br>
      <button @click="GetChartData">Refresh Data</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import BarChart from './components/BarChart.js'
import LineChart from './components/LineChart.js'
import store from './store.js'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    HelloWorld,
    BarChart
  },
data() {
return {
  strTest: 'hi',
  datacollection: null,
  msg: `Hello profile`
}
},
created() {
  console.log('Hello created')
  // this.SetChartData()
  // this.GetChartData()
},  
mounted () {    
  },
methods: {
  GetChartData (){
   store.dispatch('LoadChartDataWPromise').then(() => {
    console.log('Show after promise blah')
    this.datacollection = store.state.objChartDataCollection
    console.log(store.state.objChartDataCollection)
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
