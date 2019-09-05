import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import colorGenerator from './charts/color-generator.js'
import * as d3ScaleChromatic from 'd3-scale-chromatic'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    statemsg: 'hellostatemsg',
    strFromDateTime: '2019-07-23 22:00',
    strToDateTime: '2019-07-24 22:00',
    arChartLabels: [],
    arChartData: [],
    objChartDataCollection: null,
    objPieChartFirstRunData: null,
    //  apiurl: 'http://10.24.4.9:2082/histodata',
    title: 'Blocks By Tech',
    chartlabel: 'Blocks Cut',
    backgroundColor: '#f87979',
    // slideQueuePath: '',
    //  Prod
    // apiURL: 'http://10.24.4.9:2081',
    //  Test
    //  apiURL: 'http://10.24.4.9:2082',
    //  Local Test
    apiURL: 'http://localhost:2081',
    // Note `isActive` is left out and will not appear in the rendered table
    blockCountTableFields: ['First Run', 'Second Run', 'Third Run', 'Fourth Run'],
    //  Pulled total count
    //  blockCountTableFields: ['FirstRunBlockCount', 'SecondRunBlockCount', 'ThirdRunBlockCount', 'FourthRunBlockCount', 'TotalBlockCount'],
    blockCountTableItems: []
  },
  mutations: {
    SetStateMsg (state, strTmp) {
      state.statemsg = strTmp
    },
    SetFromDateTime (state, strTmp) {
      state.strFromDateTime = strTmp
    },
    SetToDateTime (state, strTmp) {
      state.strToDateTime = strTmp
    },
    PushChartLabels (state, strTmp) {
      state.arChartLabels.push(strTmp)
    },
    PushChartData (state, strTmp) {
      state.arChartData.push(strTmp)
    },
    PushBlockCountTableItems (state, strTmp) {
      state.blockCountTableItems.push(strTmp)
    },
    ClearBlockCountTableItems (state) {
      state.blockCountTableItems = []
    },
    ClearChartLabels (state) {
      state.arChartLabels = []
    },
    ClearChartData (state) {
      state.arChartData = []
    },
    SetChartDataCollection (state, strChartLabel) {
      state.objChartDataCollection = {
        labels: state.arChartLabels,
        datasets: [
          {
            label: strChartLabel,
            backgroundColor: state.backgroundColor,
            data: state.arChartData
          }
        ]
      }
    },
    SetChartDataCollectionForBlockCountAll (state, strChartLabel) {
      state.objChartDataCollection = {
        labels: state.blockCountTableFields[0],
        datasets: state.blockCountTableItems
      }
    },
    SetChartDataCollectionForPieChart (state) {
      //  Loop through block count and pull out just first dataset

      let arFirstRunTableItems = []
      let arFirstRunBackGroundColor = []

      state.blockCountTableItems.forEach(blockCountTableItem => {
        arFirstRunTableItems.push(blockCountTableItem.data[0])
        arFirstRunBackGroundColor.push(blockCountTableItem.backgroundColor)
      })

      state.objPieChartFirstRunData = {
        // labels: state.blockCountTableFields,
        datasets: {
          backgroundColor: arFirstRunBackGroundColor,
          data: arFirstRunTableItems
        }
      }
    },
    SetApiUrl (state, strAPIURL) {
      state.apiurl = strAPIURL
    }
  },
  actions: {
    //  template for Action w Promise
    //  ActionWPromise ({ commit }) {
    //  return new Promise((resolve, reject) => {
    //    setTimeout(() => {
    //      console.log('blah')
    //      // commit('someMutation')
    //      resolve()
    //    }, 1000)
    //  })
    //  },
    LoadChartDataWPromise ({ commit }) {
      return new Promise((resolve, reject) => {
        console.log('Hello LoadHistoData')
        console.log('api call:')
        let strFullAPICall = this.state.apiURL + '/histodata'
        console.log(strFullAPICall)
        axios.post(strFullAPICall, {
          fromdatetime: this.state.strFromDateTime,
          todatetime: this.state.strToDateTime
        })
          .then(function (response) {
            // Clear chart arrays
            commit('ClearChartLabels')
            commit('ClearChartData')
            console.log(response)
            for (var i = 0; i < response.data.length; i++) {
              let strXAxisNames = ''
              if (response.data[i].WhoPrinted === null) {
                strXAxisNames = 'Unknown'
              } else {
                strXAxisNames = response.data[i].WhoPrinted
              }
              // Build Chart Data Array
              commit('PushChartLabels', strXAxisNames)
              commit('PushChartData', response.data[i].CountOfBlockID)
            } // end for
            // Set Chart Collection Object
            commit('SetChartDataCollection', 'Blocks Cut', '#f87979')
            console.log('done test')
            resolve()
          })
          .catch(function (error) {
            console.log(error)
            reject(error)
          })
        console.log('promise done')
      })
    },
    LoadBlockCountChartData ({ commit }) {
      console.log('Hello LoadBlockCountChartData')
      commit('SetApiUrl', 'http://10.24.4.9:2082/reports')

      return new Promise((resolve, reject) => {
        axios.post(this.state.apiurl, {
          fromdatetime: this.state.strFromDateTime,
          todatetime: this.state.strToDateTime
        })
          .then(function (response) {
            // Clear chart arrays
            commit('ClearChartLabels')
            commit('ClearChartData')

            console.log(response)
            for (var i = 0; i < response.data.length; i++) {
              let strXAxisNames = ''
              if (response.data[i].WhoPrinted === null) {
                strXAxisNames = 'Unknown'
              } else {
                strXAxisNames = response.data[i].WhoPrinted
              }
              // Build Chart Data Array
              commit('PushChartLabels', strXAxisNames)
              commit('PushChartData', response.data[i].CountOfBlockID)
            } // end for
            // Set Chart Collection Object
            commit('SetChartDataCollection', 'Blocks Cut', '#f87979')
            console.log('done test')
            resolve()
          })
          .catch(function (error) {
            console.log(error)
            reject(error)
          })
        console.log('promise done')
      })
    },
    // BlockCountAllRunTimesBySortVal
    LoadPathConBlockCount ({ commit }) {
      console.log('Hello LoadBlockCountTableData')
      return new Promise((resolve, reject) => {
        let strFullAPICall = this.state.apiURL + '/reports'
        console.log('Hello Store LoadPathConBlockCount')
        console.log(strFullAPICall)
        axios.post(strFullAPICall, {
          action: 'BlockCountAllRunTimesBySortVal'
        })
          .then(function (response) {
            // Clear table data
            commit('ClearBlockCountTableItems')
            console.log()
            console.log(response)

            // Get Color Array
            let colorScale = d3ScaleChromatic.interpolateTurbo
            // let colorScale = d3ScaleChromatic.interpolatePlasma
            // See color options here: https://github.com/d3/d3-scale-chromatic works for interpolate, may work for others.
            console.log(colorScale)
            const colorRangeInfo = {
              //  Default settings
              //  colorStart: 0,
              //  colorEnd: 0.65,
              colorStart: 0.05,
              colorEnd: 0.90,
              useEndAsStart: false
            }
            let arColors = colorGenerator.interpolateColors(response.data.length, colorScale, colorRangeInfo)
            // Shuffle Color array - not active
            // ShuffleArray(arColors)
            for (var i = 0; i < response.data.length; i++) {
              // Build Chart Data Array
              let strBackgroundColor = arColors[i]
              commit('PushBlockCountTableItems', { label: response.data[i].LocAbbr, backgroundColor: strBackgroundColor, data: [response.data[i].FirstRunBlockCount, response.data[i].SecondRunBlockCount, response.data[i].ThirdRunBlockCount, response.data[i].FourthRunBlockCount] })
              // Remove Total count
              // commit('PushBlockCountTableItems', { label: response.data[i].LocAbbr, backgroundColor: strBackgroundColor, data: [response.data[i].FirstRunBlockCount, response.data[i].SecondRunBlockCount, response.data[i].ThirdRunBlockCount, response.data[i].FourthRunBlockCount, response.data[i].TotalBlockCount] })
            } // end for
            // Set Chart Collection Object
            commit('SetChartDataCollectionForBlockCountAll', 'Blocks Cut', '#f87979')

            // Set Pie Chart Data
            commit('SetChartDataCollectionForPieChart')
            
            console.log('done test')
            resolve()
          })
          .catch(function (error) {
            console.log(error)
            reject(error)
          })
        console.log('promise done')
      })
    }
  },
  getters: {
    ChartDataCollection: (state, getters) => {
      return state.objChartDataCollection
    }
  }
})

// Shuffle array Not Active
/* function ShuffleArray (array) {
  let i = 0
  let j = 0
  let temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
} */
