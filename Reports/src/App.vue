<template>
  <div id="app">

          <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <a class="navbar-brand" href="#">
          Slide Tracker Reports
      </a>
      <a class="nav-link" href="#">v Beta 0.01</a>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <b-link class="nav-link" to="home">Home</b-link>
      </li>
      <li class="nav-item">
        <b-link class="nav-link" to="/blockcountstackedbar">BC Stacked Bar</b-link>
      </li>
      <li class="nav-item">
        <b-link class="nav-link" to="/blockcountpie">BC Pie</b-link>
      </li>
      <li class="nav-item">
        <b-link class="nav-link" to="/blocksbytech">Blocks By Tech</b-link>
      </li>
      <li class="nav-item">
        <b-link class="nav-link" to="/blocksbytechline">Blocks By Tech Line</b-link>
      </li>         
         
      </ul>
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

<style lang="css">

html,
body {
  height: 100%;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
