import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
import VueRouter from 'vue-router'
import routes from './routes'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(Chartkick.use(Chart))
Vue.use(VueRouter)
Vue.use(BootstrapVue)

Vue.config.productionTip = false
const router = new VueRouter({ routes })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
