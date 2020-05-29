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
  </div>
  
  <div style="text-align:center;">
    <q-list style="display:inline-block;width:750px" >
        <User v-for="user in filteredUsers"
         :key="user.id"
         :Username="user.username"
         :Age="user.age"
         :Nationality="user.nationality"
         :Gender="user.gender"
         :Path="user.id"
         @remove="deleteUser"
         >
        </User>
    </q-list>
    </div>
  </div>
</template>


<script>
import User from './migrant_manager/User'


export default {
  name: 'DocumentType',
  props: {
    msg: String
  },
  components: {
   User
  },
  data () {
    return {
      search: ' ',
    }
  },

  computed: {
     users () {
      return this.$store.state.user.user
    }, 
    filteredUsers () {
        //if none of the fields is filled in it will give the full list of processes
        if( this.search == "") {
          return this.users
        }
        else {
          return this.users.filter((filt) =>{
          //Splits the search field and puts the words in an array
          var searchArray = this.search.split(" ")
          if( searchArray.every(string => filt.username.toLowerCase().includes(string))){
              return true;
            }})
        } 
    }
  },
  methods: {
     deleteUser(value) {
       console.log("deleting")
      var deletedUser = this.users.filter((filt) => {
          console.log("in fil")
          console.log(filt)
          console.log(filt.id == value)
          return filt.id == value
        })  
      this.$store.commit('user/deleteUser', deletedUser[0].id)
    }
  },



  created () {
    this.loading = true
    console.log(this.$store);
    this.$store.dispatch('user/fetchUser')
      .then(users => {
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
