import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    username: '',
    validuser: false,
    stationName: '',
    slideQueuePath: '',
    //  Prod
    apiURL: 'http://10.24.4.9:2081'
    //  Test
    //  apiURL: 'http://10.24.4.9:2082'
    //  Local Test
    //  apiURL: 'http://localhost:2081'
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
    }
  },
  actions: {

  },
  getters: {

  }
})
