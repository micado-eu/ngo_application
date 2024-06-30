<template>
    <q-avatar
      clickable
      @click="toProfile"
      size="42px"
      data-cy="userButton"
    >
      <q-icon
        v-if="!this.$auth.loggedIn() || !this.pic.length >0"
        size="42px"
        name="account_circle"
      />
      <img
        v-if="this.$auth.loggedIn() && this.pic.length >0"
        :src="this.pic[0].picture"
        alt="Profile"
      />
    </q-avatar>
    
</template>

<script>
import storeMappingMixin from '../mixin/storeMappingMixin'

export default {
  name: 'UserButton',
   mixins: [
    storeMappingMixin({
      getters: {
        user: 'auth/user',
        pic:'user/pic'
      }, actions: {
        getUserPic: 'user/getUserPic'
      }
    })

  ],
  data () {
    return {
      userpic:null
    }
  },
  methods: {
    toLogin () {
      this.$auth.login()

    },
    toLogout () {
      console.log("LOGGING OUT")
      this.$auth.logout()
    },
    toProfile(){
      this.$router.push({name:'profile'})
    }
  },
   created () {
    //var userId = this.$store.state.auth.user.umid
         if(this.$store.state.auth.user != null){
       console.log("GETTIN PICTURE")
      this.getUserPic(this.user.sub).then((user_found)=>{
        console.log("I AM THE PICTURE")
        console.log(user_found)
      })
     }
  }
}
</script>
