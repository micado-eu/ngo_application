  <template>
  <div class="container" >
    
  <div style="text-align:center;">
   <div class="col" style="display:inline-block;padding-right:20px;padding-left:20px">
   <q-input style="border-radius:10px; width:590px;font-size:18px" dense items-center filled v-model="search" label="Search" >
   <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
        </template>
    </q-input>
  </div>
  <div class="col" style="display:inline-block;text-align:right;width:135px">
   <q-btn style="width:135px; margin-bottom:15px" color="accent" rounded label="Add Process" no-caps size="15px" to="guided_process_editor/edit" />
  </div>
  </div>
  
  <div style="text-align:center;">
    <q-list style="display:inline-block;width:750px" >
        <Process v-for="process in filteredProcesses"
         :key="process.id"
         :Title="process.title"
         :Tag_1="process.user_tags"
         :Tag_2="process.topic_tags"
         :Link="process.id"
         Path="guided_process_editor"
         @remove="deleteProcess">
        </Process>
    </q-list>
    </div>
  </div>
</template>


<script>
import Process from './guided_process_editor/Process'


export default {
  name: 'DocumentType',
  props: {
    msg: String
  },
  components: {
   Process
  },
  data () {
    return {
      search: ' ',
    }
  },

  computed: {
     processes () {
      return this.$store.state.flows.flows
    }, 
    filteredProcesses () {
        //if none of the fields is filled in it will give the full list of processes
        if( this.search == "") {
          return this.processes
        }
        else {
          return this.processes.filter((filt) =>{
          //Splits the search field and puts the words in an array
          var searchArray = this.search.split(" ")
          if( searchArray.every(string => filt.title.toLowerCase().includes(string))){
              return true;
            }})
        } 
    }
  },
  methods: {
     deleteProcess(value) {
      var deletedProcess = this.processes.filter((filt) => {
          console.log("in fil")
          console.log(filt)
          return filt.id == value
        })  
      this.$store.commit('flows/deleteProcess', deletedProcess[0])
    }
  },



  created () {
    this.loading = true
    console.log(this.$store);
    this.$store.dispatch('flows/fetchFlows')
      .then(processes => {
        this.loading = false
      })  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 50px;
  padding-right: 80px;
  padding-bottom: 50px;
  padding-left: 80px;
}


</style>
