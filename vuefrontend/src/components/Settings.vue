<template>
  <div v-if="this.$store.getters.GetValidUser" >
    <h2 class="display-2">Cassette Engraver Location</h2>
    <b-button-toolbar>
      <b-dropdown class="m-2" text="Engraver Locations">
        <b-dropdown-item-button  v-for="item in engraver_locations" v-model="setAllValue" :key="item"  @click="setAllValue=item">{{ item }}</b-dropdown-item-button>
      </b-dropdown>
      <b-dropdown class="m-2" text="Direction">
        <b-dropdown-item-button  v-for="item in directions" v-model="setDirections" :key="item"  @click="setDirections=item">{{ item }}</b-dropdown-item-button>
      </b-dropdown>
      <b-button-group class="mx-1">
        <b-input v-model="setAllValue" placeholder="Set All Location"></b-input>
        <b-input v-model="setDirections" placeholder="Set All Direction"></b-input>
        <b-button v-on:click="setAllValues(setAllValue,setDirections)" title="Set All Values"><b-icon icon="cloud-upload" aria-hidden="true"></b-icon></b-button>
      </b-button-group>
    </b-button-toolbar>
    <b-table style="opacity: 1;background: grey" striped hover :items="items" :fields="fields" >
      <template v-slot:cell(old_value)="row">    <b-form-input v-model="row.item.old_value" :disabled='true'/></template>
      <template v-slot:cell(right_left_value)="row">
        <b-form-group  @change="checkboxFlip(row.item.old_value)">
          <b-form-radio v-model="row.item.right_left_value" :name='getIndex(row.item.old_value)' value="false">Left</b-form-radio>
          <b-form-radio v-model="row.item.right_left_value" :name='getIndex(row.item.old_value)' value="true">Right</b-form-radio>
        </b-form-group>
      </template>
      <template v-slot:cell(new_value)="row"><b-form-input v-model="row.item.new_value"/></template>
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
      engraver_locations: ['PLAZA01','MAWD01','CASSETTELABELS01'],
      directions: ['Left','Right'],
      fields: [{ key: 'old_value', label: 'CoPath_Workstation_ID' },{ key: 'right_left_value', label: 'Side' },{ key: 'new_value', label: 'Assigned_Cassette_Engraver' }],
      items: []
    }
  },
mounted() {
  console.log('MOUNTED')
  this.getValues()

},
methods: {
  setAllValues(newVal_eng,newVal_dir) {
    console.log("SET ALL VALUES")
    console.log(newVal_eng)
    console.log(this.items.forEach(element => console.log(element.old_value+' , '+element.right_left_value+' , '+element.new_value)));
    for (var item of this.items) {
      if (newVal_eng.length>0){item.new_value=newVal_eng}
      if (newVal_dir=='Right'){item.right_left_value=true}
      else if (newVal_dir=='Left'){item.right_left_value=false}
    }
    console.log("AFTER SET ALL VALUES")
    console.log(newVal_eng)
    console.log(this.items.forEach(element => console.log(element.old_value+' , '+element.right_left_value+' , '+element.new_value)));

  },
  getIndex(val){
    return this.items.findIndex(x => x.old_value ===val).toString()
  },
  checkboxFlip(val){
    this.items[this.getIndex(val)].right_left_value=!this.items[this.getIndex(val)].right_left_value;
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
          console.log("AXIOS RESPONSE")
          console.log(JSON.stringify(apidata));
          console.log(JSON.stringify(apidata.data));
          console.log(Object.keys(apidata.data))
          this.items = apidata.data
        })


  }
}
}
</script>
