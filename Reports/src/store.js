import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    statemsg: 'hellostatemsg',
    strFromDateTime: '2019-07-23 22:00',
    strToDateTime: '2019-07-24 22:00',
    arChartLabels: [],
    arChartData: [],
    objChartDataCollection: null,
    //  apiurl: 'http://10.24.4.9:2082/histodata',
    title: 'Blocks By Tech',
    chartlabel: 'Blocks Cut',
    backgroundColor: '#f87979',
	slideQueuePath: '',
    //  Prod
    // apiURL: 'http://10.24.4.9:2081',
    //  Test
    apiURL: 'http://10.24.4.9:2082',
    //  Local Test
    apiURL: 'http://localhost:2081',
    // Note `isActive` is left out and will not appear in the rendered table
    blockCountTableFields: ['location', 'FirstRunBlockCount', 'SecondRunBlockCount', 'ThirdRunBlockCount', 'FourthRunBlockCount', 'TotalBlockCount'],
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
    LoadBlockCountTableData ({ commit }) {
      console.log('Hello LoadBlockCountTableData')
      return new Promise((resolve, reject) => {
        let strFullAPICall = this.state.apiURL + '/reports'
        console.log('Hello LoadBlockCountTableData')
        console.log(strFullAPICall)
        axios.post(strFullAPICall, {
          action: 'BlockCountAllRunTimesBySortVal'
        })
          .then(function (response) {
            // Clear table data
            commit('ClearBlockCountTableItems')
            console.log()
            console.log(response)
            for (var i = 0; i < response.data.length; i++) {
              // Build Chart Data Array
              commit('PushBlockCountTableItems', { isActive: false, location: response.data[i].LocAbbr, FirstRunBlockCount: response.data[i].FirstRunBlockCount, SecondRunBlockCount: response.data[i].SecondRunBlockCount, ThirdRunBlockCount: response.data[i].ThirdRunBlockCount, FourthRunBlockCount: response.data[i].FourthRunBlockCount, TotalBlockCount: response.data[i].TotalBlockCount })
            } // end for
            // Set Chart Collection Object
            // commit('SetChartDataCollection', 'Blocks Cut', '#f87979')
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