import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    
    /*  Hardcoded for testing
      username: '',
      validuser: false,
    */

    username: 'dspencer',
    validuser: true,

    stationName: '',
    slideQueuePath: '',
    //  Prod
    //  apiURL: 'http://10.24.4.9:2081',
    //  Test
    //  apiURL: 'http://10.24.4.9:2082',
    //  Local Test
    apiURL: 'http://localhost:8083',
    // Note `isActive` is left out and will not appear in the rendered table
    // blockCountTableFields: ['location', 'FirstRunBlockCount', 'SecondRunBlockCount', 'ThirdRunBlockCount', 'FourthRunBlockCount', 'TotalBlockCount'],
    blockCountTableFields: ['location', 'block_count'],
    blockCountTableItems: [],
    // RARSapiURL: 'http://localhost:2081'
    RARSapiURL: 'https://evil-dragonfly-55.loca.lt/retrieve_slide/',
    storageGraphQLURL: 'https://pink-fish-21.loca.lt/v1/graphql'
  },
  mutations: {
    increment (state) {
      state.count++
      console.log('hello increment')
    },
    SetUserName (state, strUsername) {
      state.username = strUsername
    },
    SetValidUser (state, blTemp) {
      state.validuser = blTemp
    },
    SetStationName (state, strTemp) {
      state.stationName = strTemp
    },
    SetSlideQueuePath (state, strTemp) {
      state.slideQueuePath = strTemp
    },
    ClearBlockCountTableItems (state) {
      state.blockCountTableItems = []
    },
    PushBlockCountTableItems (state, objTmp) {
      state.blockCountTableItems.push(objTmp)
    }
  },
  actions: {
    LoadBlockCountTableData ({ commit }) {
      return new Promise((resolve, reject) => {
        let strFullAPICall = this.state.apiURL + '/reports'
        console.log('Hello LoadBlockCountTableData')
        console.log(strFullAPICall)
        axios.post(strFullAPICall, {
          // action: 'BlockCountAllRunTimesBySortVal'
          action: 'blockcount'
        })
          .then(function (response) {
            // Clear table data
            commit('ClearBlockCountTableItems')
            console.log()
            console.log(response)
            for (var i = 0; i < response.data.length; i++) {
              // Build Chart Data Array
              let strLocation = response.data[i].SlideDistributionLocation
              strLocation = strLocation.replace('LOCN', '')
              commit('PushBlockCountTableItems', { isActive: false, location: strLocation, block_count: response.data[i].BlockCount })
              //  commit('PushBlockCountTableItems', { isActive: false, location: response.data[i].LocAbbr, FirstRunBlockCount: response.data[i].FirstRunBlockCount, SecondRunBlockCount: response.data[i].SecondRunBlockCount, ThirdRunBlockCount: response.data[i].ThirdRunBlockCount, FourthRunBlockCount: response.data[i].FourthRunBlockCount, TotalBlockCount: response.data[i].TotalBlockCount })
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
    },
    LoadBlockCountTableDataOld ({ commit }) {
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
    BlockCountTableFields: (state, getters) => {
      return state.blockCountTableFields
    },
    BlockCountTableItems: (state, getters) => {
      return state.blockCountTableItems
    }
  }
})
