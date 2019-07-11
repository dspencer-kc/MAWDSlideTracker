import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    username: '',
    validuser: false,
    stationName: '',
    slideQueuePath: ''
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
