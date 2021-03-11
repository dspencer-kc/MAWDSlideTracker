<!-- ===========================================================================================

    File: App.vue

    Authors: Drew Spencer

    Description: App.vue handles the login actions, and pulls in the slide component (also passses
        the login variables to this component.  The CSS also is contained here.  This is probably
        not the right spot for it, but I'm not sure with vue the best place for it to go.

    Notes: Working towards StandardJS.
============================================================================================ -->



<template>
  <div id="app">

    <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
      <a class="navbar-brand" href="#">
          Slide Tracker
      </a>
      <a class="nav-link" href="#">v 3.05</a>
      <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <b-link class="nav-link" to="/">Home</b-link>
      </li>          
      <li class="nav-item">
        <b-link class="nav-link" to="/slidedistribution"> Slide Distribution </b-link>
      </li>
      <li class="nav-item">
        <b-link class="nav-link" to="/slidestorage"> Slide Storage </b-link>
      </li>        
        <li class="nav-item">
        <a class="nav-link" href="#">You must badge in prior to printing slides.</a>
      </li>
          <form  v-on:submit.prevent="scanbadge()" class="form-inline my-2 my-lg-0">
          <b-input id="InputBadge" class="mb-2 mr-sm-2 mb-sm-0" onfocus="this.value=''" read-only="true" autocomplete="false"  :disabled=true v-model="scannedbadgeinput" placeholder="Scan Badge" />
           <button class="btn btn-sm btn-outline-secondary" type="submit">{{scannedbadgebuttontext}}</button>
         </form>
      </ul>
    </nav>


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

<style lang="css">

html,
body {
  background-image: url("./assets/background.jpg");
  height: 100%;
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

body {
  margin: 0;

  font-family: Roboto, sans-serif;

}
.customheadertext {
 text-rendering: optimizeLegibility;
      color: #e0dfdc;
      letter-spacing: .1em;
      }

.customsubheadertext {
 text-rendering: optimizeLegibility;
      color: #e0dfdc;
      letter-spacing: .1em;
      color: white;
      text-shadow: -1px -1px 0 #2c2d2d, 1px -1px 0 #2c2d2d, -1px 1px 0 #2c2d2d, 1px 1px 0 #2c2d2d;
      }

.glassslide {
  background: rgba(255, 255, 255, 1);
  height: 400px;

  background: -moz-linear-gradient(top,  rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,1)), color-stop(100%,rgba(255,255,255,0)));
  background: -webkit-linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  background: -o-linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  background: -ms-linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  background: linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  border: 1px solid #DDDBD7;
  -webkit-box-shadow: 3px 3px 10px rgba(0,0,0,0.4),	inset 0 0 10px rgba(255,255,255, 0.8);
  -moz-box-shadow: 	3px 3px 10px rgba(0,0,0,0.4),	inset 0 0 10px rgba(255,255,255, 0.8);
  box-shadow: 		3px 3px 10px rgba(0,0,0,0.4),	inset 0 0 10px rgba(255,255,255, 0.8);
  -webkit-border-radius: 5px;
  -moz-border-radius: 10px;
  border-bottom-radius: 10px;
  background: rgba(255, 255, 255, .35);

}
.slidelabel {
  margin:1px 1px 1px 1px;
  height: 160px;
  border: 1px solid silver;
  background-color: white;
}

.slideheader{
  display: block;
font-size: 1.30em;
margin-block-start: 1em;
margin-block-end: 1em;
margin-inline-start: 0px;
margin-inline-end: 0px;
font-weight: bold;
text-align: center;
margin-top:0px;
margin-bottom:-10px;
padding: 0px;
padding-top: 0px;
padding-right: -5px;
padding-bottom: 0px;
padding-left: -5px;
color: black;
    line-height: normal !important;
}
.slidebody{
  display: block;
margin-block-start: 1em;
margin-block-end: 1em;
margin-inline-start: 0px;
margin-inline-end: 0px;
text-align: left;
margin-bottom:-10px;
color: black;
  line-height: normal !important;
}
.slidefooter{
  display: block;
margin-block-start: 1em;
margin-block-end: 1em;
margin-inline-start: 0px;
margin-inline-end: 0px;
text-align: center;
margin-top:-7px;
margin-bottom:-10px;
color: black;
    line-height: normal !important;
}

.row-flex {
  display: flex;
  flex-wrap: wrap;
  height: 450px;
}

/* vertical spacing between columns */

[class*="col-"] {
  margin-bottom: 30px;
}

.content {
  height: 100%;
  padding: 20px 20px 10px;
  color: #fff;
}



/*
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
*/


table {
  width: 1100px;
  border-collapse: separate;
  border-spacing: 10px 2px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

th,
td {
  padding: 15px;
    padding-top: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: solid thin;
}

th {
  text-align: left;
}

thead {
  th {
    background-color: #55608f;
  }
}

tbody {
  tr {
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
  td {
    position: relative;
    &:hover {
      &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: -9999px;
        bottom: -9999px;
        background-color: rgba(255, 255, 255, 0.2);
        z-index: -1;
      }
    }
  }
}

</style>



<script>

//import Slides from './components/Slides'
//import Slides from './components/SlidesV2'
import Slides from './components/SlidesV3'
import axios from 'axios'
import store from './store.js'
//const strApiUrl = process.env.VUE_APP_API_URL
//Prod
// const strApiUrl = Set in store
//Test
// const strApiUrl = Set in store
//Local Test
//const strApiUrl = Set in store
console.log('APIURL: ', store.state.apiURL)
//import io from 'socket.io-client' //Not sure if this needs done here or just in main.js

export default
{
  name: 'app',
  components:
      {
        Slides
      },
data() {
return {

  userinfo: {},
  // username: "usernameinitialvalue", moved to store
  firstname: "firstnameinitialvalue",
  lastname: "lastnameinitialvalue",
  userid: "useridinitialvalue",
  background: "backgroundinitialvalue",
  scannedbadgeinput: "Scan Badge To Start",
  // validuser: false, moved to store
  scannedbadgebuttontext: "Scan Badge",
  userstate: "no active user",
  badgeInputTextBoxDisabled: false
  // stationname: ''
  // blockid:''
}
},
/*
sockets: {
    connect: function () {
        console.log('socket connected')
    },
    customEmit: function (data) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
    stream: function(data) {
        console.log('socket on')

        //validate scan data
        this.validateScanData(data)

    }
},  */
methods: {
  validateScanData(data){
    //this.stationname = data.stationName
    //Depending on prefix, send to correct placeholder
    console.log('barcodescan', data.barcodeScanData)
    console.log('prefix', data.barcodeScanData.substring(0,4))

    switch(data.barcodeScanData.substring(0,4)) {
      case 'HBLK':
        //Handled within Slides Component
        //this.blockid = data.barcodeScanData
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
        // code block
    }



    //this.forwardBarcodeScan(data.barcodeScanData) //Received value should be json object matched on data

  },
  scanbadge()
  {
  console.log("helloscan");

  //If someone is signed in, log out
  if ( this.scannedbadgebuttontext == "Log Out"){

    store.commit('SetValidUser', false)
    this.userinfo = "";
    this.firstname = ""
    this.lastname = ""
    this.background = ""
    store.commit('SetUserName', '')
    this.scannedbadgeinput = "Please Scan Badge"
    this.scannedbadgebuttontext = "Scan Badge"
    this.badgeInputTextBoxDisabled = false

  } else {
    //validate scanned Badge
    if (this.scannedbadgeinput.substring(0,4)=="SBDG") {
            this.userid = this.scannedbadgeinput.substring(4);

            console.log("valid badge prefix");
            console.log(store.state.apiURL)
              axios.post(store.state.apiURL + '/getuserinfo', {
              userid: this.userid
              //userid: 'mwd2954'
            })
            .then(userinfodata => {
              this.loading = false;
              this.error_message = '';
              if (userinfodata.errorcode) {
                this.error_message = `Error looking up badge.`
                console.log('error')
                return
              }

              console.log("Made it to this.userinfo=data");
              console.log(userinfodata);
              this.userinfo = userinfodata.data;
              this.firstname = this.userinfo[0].fname;
              this.lastname = this.userinfo[0].lname;
              this.background = this.userinfo[0].background;
              store.commit('SetUserName', this.userinfo[0].username)

              //Validate user
               if (store.state.username.length > 0  ) {
                 this.userstate = "valid user";
                 store.commit('SetValidUser', true)
                 this.scannedbadgebuttontext = "Log Out";
                 this.scannedbadgeinput = store.state.username
                 this.badgeInputTextBoxDisabled = true
               }

            }).catch((e) => {
              console.log(e)
            })
            .catch(function (error) {
              console.log("error:");
              console.log(error);
            });
          //Verify userid

    } else {
        //Invalid badge
        console.log("invalid badge prefix or badge error");
    }
  }
    console.log("end scanbadge");
  }

},

computed:{
  scanBadgeButtonDisabled(){
    //if (this.validuser=='f' || !blockID ) {
    if (store.state.validuser && this.blockID) {
      return false
    } else {
      return true
    }
  }
  //,
  //inputTextBoxDisabled(){
  //  //Disable input text if no valid user
  //  if (this.userstate=="no active user") {
  //    return false
  //  } else {
  //    return true
  //  }
  //}
}
}



</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
