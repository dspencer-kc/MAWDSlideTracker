import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import VueSocketIO from 'vue-socket.io'
import VueRouter from 'vue-router'
import routes from './routes'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use(VueApollo)
Vue.config.productionTip = false

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'ws://localhost:8080/v1/graphql',
})

const getHeaders = () => {
  const headers = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'x-hasura-access-key': 'myadminsecretkey'
  }

  return headers;
};

// Create a WebSocket link:

const link = new WebSocketLink({

  uri: 'ws://localhost:8080/v1/graphql',
 
  options: {
 
    reconnect: true,
 
    timeout: 30000,
 
    connectionParams: () => {
 
      return { headers: getHeaders() };
 
    },
  }
 });

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
// Vue.use(new VueSocketIO({
//  debug: true,
//  connection: 'http://localhost:8001'
// }))

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
})
const apolloProvider = new VueApollo({
  defaultClient: client,
})
const router = new VueRouter({ routes })

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
