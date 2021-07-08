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
    <b-table style="opacity: 1;background: grey" striped hover :items="items" :fields="fields" ref="table">
      <template v-slot:cell(CoPath_Workstation_ID)="row">    <b-form-input v-model="row.item.CoPath_Workstation_ID" :disabled='true'/></template>
      <template v-slot:cell(Side)="row">
        <b-form-group  @change="checkboxFlip(row.item.CoPath_Workstation_ID)">
          <b-form-radio v-model="row.item.Side" :name='getIndex(row.item.CoPath_Workstation_ID)' value="false">Left</b-form-radio>
          <b-form-radio v-model="row.item.Side" :name='getIndex(row.item.CoPath_Workstation_ID)' value="true">Right</b-form-radio>
        </b-form-group>
      </template>
      <template v-slot:cell(Assigned_Cassette_Engraver)="row"><b-form-input v-model="row.item.Assigned_Cassette_Engraver"/></template>
    </b-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      setAllValue:'',
      setDirections:'',
      engraver_locations: ['PLAZA01','MAWD01','CASSETTELABELS01'],
      directions: ['Left','Right'],
      fields: { CoPath_Workstation_ID: "CoPath_Workstation_ID", Side: "Side", Assigned_Cassette_Engraver: "Assigned_Cassette_Engraver" },
      items: [{ CoPath_Workstation_ID: "",Side:true,Assigned_Cassette_Engraver: "CASSETTELABELS01"},
        { CoPath_Workstation_ID: "MAWD.00-.B",Side:true,Assigned_Cassette_Engraver: "CASSETTELABELS01"},
        { CoPath_Workstation_ID: "MAWD.00-.K",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MAWD.00-.M",Side:false,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.00-.7",Side:true,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.LP-02",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MAWD.LP-06",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MAWD.00.13",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MAWD.00.10",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MWD012",    Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "NKC-.05-01",Side:true,Assigned_Cassette_Engraver: "PLAZA01"},
        { CoPath_Workstation_ID: "MAWD.00.1E",Side:false,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.00.1F",Side:false,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.00.1J",Side:false,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.00.1K",Side:true,Assigned_Cassette_Engraver: "MAWD01"},
        { CoPath_Workstation_ID: "MAWD.00-.G",Side:true,Assigned_Cassette_Engraver: "CASSETTELABELS01"},
        { CoPath_Workstation_ID: "MAWD.LP-.1",Side:false,Assigned_Cassette_Engraver: "PLAZA01"}
      ]
    }
  },
methods: {
  setAllValues(newVal_eng,newVal_dir) {
    console.log("SET ALL VALUES")
    console.log(newVal_eng)
    console.log(this.items.forEach(element => console.log(element.CoPath_Workstation_ID+' , '+element.Side+' , '+element.Assigned_Cassette_Engraver)));
    for (var item of this.items) {
      if (newVal_eng.length>0){item.Assigned_Cassette_Engraver=newVal_eng}
      if (newVal_dir=='Right'){item.Side=true}
      else if (newVal_dir=='Left'){item.Side=false}
    }
    console.log("AFTER SET ALL VALUES")
    console.log(newVal_eng)
    console.log(this.items.forEach(element => console.log(element.CoPath_Workstation_ID+' , '+element.Side+' , '+element.Assigned_Cassette_Engraver)));

  },
  getIndex(val){
    return parseInt(this.items.findIndex(x => x.CoPath_Workstation_ID ===val))
  },
  checkboxFlip(val){
    this.items[this.getIndex(val)].Side=!this.items[this.getIndex(val)].Side;
  },
  SaveAllChanges(){
    console.log("SAVE ALL CHANGES");
    console.log(this.items.forEach(element => console.log(element.CoPath_Workstation_ID+' , '+element.Side+' , '+element.Assigned_Cassette_Engraver)));
  }
}
}
</script>
