import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    username: '',
    validuser: false,
    stationName: '',
    testmode: true,
    slideQueuePath: '',
    testapiURL: 'http://localhost:2081',
    prodapiURL: 'http://10.24.4.9:2081',
    blockCountTableFields: ['location', 'block_count'],
    blockCountTableItems: []
  },
  mutations: {
    increment (state) {
      state.count++
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
        let strFullAPICall = this.getters.getApiUrl + '/reports'
        axios.post(strFullAPICall, {
          action: 'blockcount'
        })
          .then(function (response) {
            commit('ClearBlockCountTableItems')
            for (var i = 0; i < response.data.length; i++) {
              commit('PushBlockCountTableItems', { isActive: false, location: response.data[i].SlideDistributionLocation.replace('LOCN', ''), block_count: response.data[i].BlockCount })
            }
            resolve()
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
  },
  getters: {
    BlockCountTableFields: (state) => {
      return state.blockCountTableFields
    },
    BlockCountTableItems: (state) => {
      return state.blockCountTableItems
    },
    GetValidUser: (state) => {
      if (!state.testmode){
        return state.validuser
      }
      return true
    },
    GetUsername: (state) => {
      return state.username
    },
    GetTestmode: (state) => {
      return state.testmode
    },
    getApiUrl: (state) => {
      if (state.testmode){return state.testapiURL}
      else {return state.prodapiURL}
    }
  }
})
