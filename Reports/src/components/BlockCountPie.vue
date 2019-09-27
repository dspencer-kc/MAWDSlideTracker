// BlockCountPie.vue

<template>
    <div>
    <h1>Block Count</h1>
    <b-container class="bv-example-row">
  <b-row>
    <b-col>    
      <pie-chart 
        v-if='loaded'
        :chart-data="objFirstRunData" 
        :options="objFirstRunOptions" 
        :width="1" 
        :height="1"
      />
    </b-col>
    <b-col>    
      <pie-chart 
        v-if='loaded'
        :chart-data="objSecondRunData" 
        :options="objSecondRunOptions" 
        :width="1" 
        :height="1"
      />
    </b-col>
    <b-col>
      <pie-chart 
        v-if='loaded'
        :chart-data="objThirdRunData" 
        :options="objThirdRunOptions" 
        :width="1" 
        :height="1"
      />
    </b-col>
    <b-col>
      <pie-chart 
        v-if='loaded'
        :chart-data="objFourthRunData" 
        :options="objFourthRunOptions" 
        :width="1" 
        :height="1"
      />
    </b-col>
  </b-row>
</b-container>


    <pie-chart 
      v-if='loaded'
      :chart-data="objAllRunData" 
      :options="objTotalRunOptions" 
      :width="12" 
      :height="3"
    />




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
  objFirstRunData: null,
  objSecondRunData: null,
  objThirdRunData: null,
  objFourthRunData: null,
  objAllRunData: null,
  objFirstRunOptions: {
    title: {
      display: true,
      text: 'First Run'
    },
    legend: {
      display: false
    }
  },
  objSecondRunOptions: {
    title: {
      display: true,
      text: 'Second Run'
    },
    legend: {
      display: false
    }
  },
  objThirdRunOptions: {
    title: {
      display: true,
      text: 'Third Run'
    },
    legend: {
      display: false
    }
  },
  objFourthRunOptions: {
      title: {
        display: true,
        text: 'Fourth Run'
      },
      legend: {
        display: false
      }
  },
  objTotalRunOptions: {
      title: {
        display: true,
        text: 'Block Count All Runs',
    },
    legend: {
      display: true,
      position: 'bottom'
    }
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
    this.objAllRunData = store.state.objPieChartTotalData
    this.objFirstRunData = store.state.objPieChartFirstRunData
    this.objSecondRunData = store.state.objPieChartSecondRunData
    this.objThirdRunData = store.state.objPieChartThirdRunData
    this.objFourthRunData = store.state.objPieChartFourthRunData
    this.loaded=true
    
   })   
  },
},
computed: {
    
} 
}
</script>