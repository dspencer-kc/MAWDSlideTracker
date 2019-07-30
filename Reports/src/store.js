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
    apiurl: 'http://10.24.4.9:2082/histodata',
    title: 'Blocks By Tech',
    chartlabel: 'Blocks Cut',
    backgroundColor: '#f87979'
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
    }
  },
  getters: {
    ChartDataCollection: (state, getters) => {
      return state.objChartDataCollection
    }
  }
})
