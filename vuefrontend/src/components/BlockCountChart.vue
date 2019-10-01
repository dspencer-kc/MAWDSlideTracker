<!-- ===========================================================================================

    File: BlockCountChart.vue

    Authors: Drew Spencer

============================================================================================ -->
<template>
<div class="container">

  <b-table striped hover dark small borderless :items="arBlockCountTableItems" :fields="arBlockCountTableFields"></b-table>


</div>  <!-- /container -->
</template>


<!--components/Slides.vue -->
<script>
import axios from 'axios'
import store from '../store.js'

export default {
  name: 'blockcount', // component name
  props: {
    lastname: String,
    userid: String,
    },
    data() {
    return {
        fields: store.state.blockCountTableFields,
        items: store.state.blockCountTableItems
    }
  },
  created() {
          console.log('Hello created')
          this.LoadTableData()
  },
  methods: {
      LoadTableData() {
        store.dispatch('LoadBlockCountTableData').then(() => {
        console.log('Show after promise blah')
        // this.datacollection = store.state.objChartDataCollection
        console.log(store.state.blockCountTableItems)
        }) 
      }

  },
    computed: {
        arBlockCountTableItems () {
            return this.$store.getters.BlockCountTableItems
        },
        arBlockCountTableFields () {
            return this.$store.getters.BlockCountTableFields
        } 
    }
}
</script>

<style scoped>
#slides {
  margin: 30px 0;
}

.loader {
  text-align: center;
}
</style>
