<template>
  <div id="app">
    <b-navbar class="navbar navbar-dark bg-dark fixed-top">
      <b-badge>Slide Tracker</b-badge>
      <b-item style='color: #b700ff;font-style: italic;font-size: smaller'>&nbsp; bev
        <badge> {{ $store.getters.GetBEVersion }}</badge>
      </b-item>
      <b-item style='color: #007bff;font-style: italic;font-size: smaller'>&nbsp; fev
        <badge> {{ $store.getters.GetFEVersion }}</badge>
      </b-item>
      <b-item style='color: #ffffff'>
        &nbsp; Prod &nbsp;
        <b-icon v-if="$store.getters.GetProduction" icon="check-square" scale="1" variant="success"></b-icon>
        <b-icon v-if="!$store.getters.GetProduction" icon="x-circle" scale="1" variant="danger"></b-icon>
        &nbsp; Socket &nbsp;
        <b-icon v-if="$store.getters.GetSocketStatus" icon="check-square" scale="1" variant="success"></b-icon>
        <b-icon v-if="!$store.getters.GetSocketStatus" icon="x-circle" scale="1" variant="danger"></b-icon>
        &nbsp; Server &nbsp;
        <b-icon v-if="$store.getters.GetBackendStatus" icon="check-square" scale="1" variant="success"></b-icon>
        <b-icon v-if="!$store.getters.GetBackendStatus" icon="x-circle" scale="1" variant="danger"></b-icon>
      </b-item>
      <b-item v-if="$store.getters.GetnodeBackendTestMode" class="navbar-brand"
              style="background-image: linear-gradient(#f3edd4, #ff6f69);margin-left: 15px">BACKEND LOCAL
      </b-item>
      <b-item v-if="$store.getters.GetvueFrontendTestMode" class="navbar-brand"
              style="background-image: linear-gradient(#e7d0ce, #ffcc5c);margin-left: 15px">FRONTEND LOCAL
      </b-item>
      <b-navbar-nav class="ml-auto">
        <b-link v-if="$store.getters.GetValidUser" :active="this.currentRouteName =='home'" class="nav-link" to="/">
          Home
        </b-link>
        <b-link v-if="$store.getters.GetValidUser" :active="this.currentRouteName =='Embedding'" class="nav-link"
                to="/embedding"> Embedding
        </b-link>
        <b-link v-if="$store.getters.GetValidUser" :active="this.currentRouteName =='SlidePrinting'" class="nav-link"
                to="/slideprinting"> Slide Printing
        </b-link>
        <b-link v-if="$store.getters.GetValidUser" :active="this.currentRouteName =='SlideDistribution'" class="nav-link"
                to="/slidedistribution"> Slide Distribution
        </b-link>
        <b-nav-item-dropdown no-caret right>
          <template #button-content>
                    <span>
                      <b-badge v-model="scannedbadgeinput" :model="scannedbadgeinput"
                               :style="getInputColor(scannedbadgeinput)">  {{ scannedbadgeinput }}</b-badge>
                      <b-icon v-if="$store.getters.GetValidUser" icon="person-check" shift-h="3" shift-v="-3"
                              variant="success">    </b-icon>
                      <b-icon v-if="!$store.getters.GetValidUser" icon="person-x" shift-h="3" shift-v="-3"
                              variant="danger">     </b-icon>
                    </span>
          </template>
          <b-dd-item v-if="$store.getters.GetValidUser" to="/settings">Settings</b-dd-item>
          <b-dd-item to="/caseinquiry">Case Inquiry</b-dd-item>
          <b-dd-item v-if="$store.getters.GetValidUser" @click="logout()">Log Out</b-dd-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <div class="container">
      <br>
      <div class="row">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style>
@import './assets/app_style.css';
</style>
<script>
import axios from 'axios'
import store from './store.js'

export default {
  name: 'app',
  data() {
    return {
      userinfo: {},
      scannedbadgeinput: "Scan Badge To Start",
      defaultbadgeinput: "Scan Badge To Start",
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
      store.commit('SetSocketConn', true)
    },
    disconnect: function () {
      console.log('socket disconnected')
      store.commit('SetSocketConn', false)
    },
    stream: function (data) {
      console.log('socket on')
      this.validateScanData(data)

    }
  },
  mounted() {
    if (this.nodeEnv === 'production') {
      store.commit('production', true)
    } else {
      store.commit('production', false)
    }
    this.getBEVersion()
  },
  methods: {
    getBEVersion() {
      axios.get(store.getters.getApiUrl + '/getVersion')
          .then(userinfodata => {
            store.commit('SetbackendVersion', userinfodata.data)
            store.commit('SetbackendConn', true)
          }).catch((e) => {
        this.makeToast("Log In Error: " + e, "Error", "danger")
      })
    },
    validateScanData(data) {
      switch (data.barcodeScanData.substring(0, 4)) {
        case 'HBLK':
          break
        case 'SBDG':
          store.commit('SetSlideQueuePath', data.slideQueuePath)
          store.commit('SetStationName', data.stationName)
          this.scannedbadgeinput = data.barcodeScanData
          this.scanbadge()
          break
        default:
      }
    },
    logout() {
      store.commit('SetValidUser', false)
      store.commit('SetUserName', '')
      this.scannedbadgeinput = this.defaultbadgeinput
      this.makeToast("Logging out user", "Logged Out", "warning")
    },
    scanbadge() {
      if (this.scannedbadgeinput.substring(0, 4) === "SBDG") {
        this.userid = this.scannedbadgeinput.substring(4);
        axios.post(store.getters.getApiUrl + '/getUserInfo', {
          userid: this.userid
        })
            .then(userinfodata => {
              this.loading = false;
              this.error_message = '';
              if (userinfodata.errorcode) {
                this.error_message = `Error looking up badge.`
                this.makeToast("invalid badge prefix or badge error", "invalid badge", "danger")
                console.log('error')
                return
              }
              this.userinfo = userinfodata.data;
              store.commit('SetUserName', this.userinfo[0].username)
              //Validate user
              if (store.getters.GetUsername.length > 0) {
                store.commit('SetValidUser', true)
                this.scannedbadgeinput = store.getters.GetUsername
                this.makeToast("User Logged In", "Logged In", "success")
              }
            }).catch((e) => {
          console.log(e)
          this.makeToast("Log In Error: " + e, "Error", "danger")
        })
      } else {
        this.makeToast("invalid badge prefix or badge error", "invalid badge", "danger")
      }
    },
    getInputColor(text) {
      if (text !== this.defaultbadgeinput && !/\d/.test(text) && text.length > 0) return {'background-color': '#28a745'};
      if (text !== this.defaultbadgeinput && /\d/.test(text) && text.length > 0) return {'background-color': '#ffc107'};
      if (text === this.defaultbadgeinput) return {'background-color': '#dc3545'};
      return {'background-color': '#ffc107'};
    },
    makeToast(content, title, variant = null, time = 1500) {
      this.$bvToast.toast(content, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: time,
        toaster: "b-toaster-top-left"
      })
    }


  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    nodeEnv() {

      return process.env.NODE_ENV
    }

  }
}
</script>
