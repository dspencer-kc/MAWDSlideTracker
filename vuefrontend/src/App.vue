<template>
  <div id="app">

      <b-navbar class="navbar navbar-dark bg-dark fixed-top">
          <a class="navbar-brand" href="#">Slide Tracker</a>
          <b-nav-item>v {{$store.getters.GetVersion}} </b-nav-item>
          <span class="navbar-brand" style="background-image: linear-gradient(#f3edd4, #ff6f69)" v-if="$store.getters.GetnodeBackendTestMode">BACKEND LOCAL</span>
          <span class="navbar-brand" style="background-image: linear-gradient(#e7d0ce, #ffcc5c)" v-if="$store.getters.GetvueFrontendTestMode">FRONTEND LOCAL</span>
          <b-navbar-nav class="ml-auto">
              <b-link class="nav-link" to="/"                  v-if="$store.getters.GetValidUser"> Home               </b-link>
              <b-link class="nav-link" to="/embedding"         v-if="$store.getters.GetValidUser"> Embedding          </b-link>
              <b-link class="nav-link" to="/slideprinting"     v-if="$store.getters.GetValidUser"> Slide Printing     </b-link>
              <b-link class="nav-link" to="/slidedistribution" v-if="$store.getters.GetValidUser"> Slide Distribution </b-link>
              <b-nav-item-dropdown right  no-caret>
                  <template #button-content >
                    <h5 >
                      <b-badge v-model="scannedbadgeinput" :style="getInputColor(scannedbadgeinput)" :model="scannedbadgeinput">  {{scannedbadgeinput}}</b-badge>
                      <b-icon shift-h="3" shift-v="-3" v-if="$store.getters.GetValidUser"   icon="person-check" variant="success">    </b-icon>
                      <b-icon shift-h="3" shift-v="-3" v-if="!$store.getters.GetValidUser"  icon="person-x"     variant="danger">     </b-icon>
                    </h5>
                  </template>
                  <b-dd-item v-if="$store.getters.GetValidUser" to="/settings">Settings</b-dd-item>
                  <b-dd-item v-if="$store.getters.GetValidUser" to="/caseinquiry">Case Inquery</b-dd-item>
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


<script>
export default {
}
</script>

<style >
@import './assets/app_style.css';



</style>
<script >
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
        connect: function() {
            console.log('socket connected')
        },
        customEmit: function(data) {
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        },
        stream: function(data) {
            console.log('socket on')
            this.validateScanData(data)

        }
    },
    methods: {
        validateScanData(data) {
                console.log('barcodescan', data.barcodeScanData)
                console.log('prefix', data.barcodeScanData.substring(0, 4))
                switch (data.barcodeScanData.substring(0, 4)) {
                    case 'HBLK':
                        break
                    case 'SBDG':
                        console.log('Slide Queue Path: ', data.slideQueuePath)
                        store.commit('SetSlideQueuePath', data.slideQueuePath)
                        console.log('slide station name:', data.stationName)
                        store.commit('SetStationName', data.stationName)
                        this.scannedbadgeinput = data.barcodeScanData
                        this.scanbadge()
                        break
                    default:
                }
            },
            logout(){
              store.commit('SetValidUser', false)
              store.commit('SetUserName', '')
              this.scannedbadgeinput = this.defaultbadgeinput
              this.makeToast("Logging out user", "Logged Out", "warning")
            },
            scanbadge() {
                    if (this.scannedbadgeinput.substring(0, 4) === "SBDG") {
                        this.userid = this.scannedbadgeinput.substring(4);
                        axios.post(store.getters.getApiUrl + '/getuserinfo', {
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
                                this.makeToast("Log In Error: "+e, "Error", "danger")
                            })
                            .catch(function(error) {
                                this.makeToast("Log In Error: "+error, "Error", "danger")
                            });
                    } else {
                        this.makeToast("invalid badge prefix or badge error", "invalid badge", "danger")
                    }
            },
            getInputColor(text) {
                if (text !== this.defaultbadgeinput && !/\d/.test(text) && text.length > 0) return {
                    'background-color': '#96ceb4'
                };
                if (text !== this.defaultbadgeinput && /\d/.test(text) && text.length > 0) return {
                    'background-color': '#ffcc5c'
                };
                if (text === this.defaultbadgeinput) return {
                    'background-color': '#ff6f69'
                };
                return {
                    'background-color': '#ffcc5c'
                };
            },
            makeToast(content, title, variant = null) {
                this.$bvToast.toast(content, {
                    title: title,
                    variant: variant,
                    solid: true,
                    autoHideDelay: 1000,
                    toaster: "b-toaster-bottom-right"
                })
            }


    }
}
</script>
