import Vue from 'vue'

import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
//import socketio from 'socket.io-client'
//export const SocketInstance = socketio('http://localhost:8001');
//var socket = io('http://localhost:8001');
import VueSocketIO from 'vue-socket.io'

//import socketio from '../node_modules/socket.io'
//import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
//Vue.use(SocketInstance)
//Vue.use(socketio)

Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8001'
}))

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
