<template>
  <div class="container" v-if="this.$store.getters.GetValidUser" >
    <h1>Cassette Engraver Location</h1>
    <b-button-group class="mr-1">
      <b-button title="Save file" v-on:click="setAllValues(setAllValue,setDirections)">
        <b-icon icon="cloud-upload" aria-hidden="true"></b-icon>
      </b-button>
      <b-button title="Load Default">
        <b-icon icon="cloud-download" aria-hidden="true"></b-icon>
      </b-button>
    </b-button-group>
    <b-dropdown class="m-2" text="Engraver Locations">
      <b-dropdown-item-button  v-for="item in engraver_locations" v-model="setAllValue" :key="item"  @click="setAllValue=item">{{ item }}</b-dropdown-item-button>
    </b-dropdown>
    <b-button-group class="mx-1">
    <b-input disabled v-model="setAllValue" placeholder="Set All Location"></b-input>
    </b-button-group>
    <b-dropdown class="m-2" text="Direction">
      <b-dropdown-item-button  v-for="item in directions" v-model="setDirections" :key="item"  @click="setDirections=item">{{ item }}</b-dropdown-item-button>
    </b-dropdown>
    <b-button-group class="mx-1">
    <b-input disabled v-model="setDirections" placeholder="Set All Direction"></b-input>
    </b-button-group>

    <br>
    <b-table style="opacity: .90;white-space: nowrap;" striped hover dark small borderless :items="items" :fields="fields" >
      <template v-slot:cell(old_value)="row">    <b-form-input v-model="row.item.old_value" :disabled='true'/></template>
      <template v-slot:cell(right_left_value)="row">
        <b-form-group>
          <b-form-checkbox v-model="row.item.right_left_value" switch>
            <span v-if="row.item.right_left_value">RIGHT SIDE</span>
            <span v-if="!row.item.right_left_value">LEFT SIDE</span>
          </b-form-checkbox>
        </b-form-group>
      </template>
      <template   v-slot:cell(new_value)="row">
        <b-form-select v-model="row.item.new_value" :options="engraver_locations">
        </b-form-select>
      </template>
    </b-table>
  </div>
</template>


<script>
import axios from "axios";
import store from "@/store";

export default {
  data() {
    return {
      setAllValue:'',
      setDirections:'',
      engraver_locations: ['PLAZA01','MAWD01','MAWD02','CASSETTELABELS01'],
      directions: ['  ','Left','Right'],
      fields: [{ key: 'old_value', label: 'CoPath_Workstation_ID' },{ key: 'right_left_value', label: 'Side' },{ key: 'new_value', label: 'Assigned_Cassette_Engraver' }],
      items: []
    }
  },
mounted() {
  this.getValues()
},
methods: {
  setAllValues(newVal_eng,newVal_dir) {
    for (var item of this.items) {
      if (newVal_eng.length>0){item.new_value=newVal_eng}
      if (newVal_dir=='Right'){item.right_left_value=true}
      else if (newVal_dir=='Left'){item.right_left_value=false}
    }
    this.SaveAllChanges()
  },
  getIndex(val){
    return this.items.findIndex(x => x.old_value ===val).toString()
  },
  checkboxFlip(val){
    this.items[this.getIndex(val)].right_left_value=!this.items[this.getIndex(val)].right_left_value;
    console.log(val)
  },
  SaveAllChanges(){
    console.log("SAVE ALL CHANGES");
    console.log(this.items.forEach(element => console.log(element.old_value+' , '+element.right_left_value+' , '+element.new_value)));
  },
  getValues(){
    axios.post(store.getters.getApiUrl + '/GetCassEngLoc', {
      action: 'GetCassEngLoc'
    })
        .then(apidata => {
          this.items = apidata.data
          for (var item of this.items) {
            if (item.right_left_value==1){item.right_left_value=true}
            else if (item.right_left_value==0){item.right_left_value=false}
          }
          console.log(JSON.stringify(apidata.data))
        })


  }
},
  computed:{
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>
