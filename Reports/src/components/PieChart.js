import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    console.log('piechartjs mounted')
    console.log(this.chartData)
    this.renderChart(this.chartData, this.options)
  }
}
