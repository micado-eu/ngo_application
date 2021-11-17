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

      /*
      let d = new Date()
      let t = d.getTime()

      //      let aut_url = "https://identity.micado.csi.it/oauth2/authorize" + "?client_id=" + "tYvjG7o_50SYIRXl3ny_QqTZZzsa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=http://localhost:8080/callback"
      //      let aut_url = "https://localhost:9443/oauth2/authorize" + "?client_id=" + "Ez9iXQbVGu6vdad24xgb_rRt9Yga" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=http://localhost:8080/callback"
      //      let aut_url = "https://localhost:9443/oauth2/authorize" + "?client_id=" + "pSoOnCk41wDduPOHkwmro42cfgUa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=http://localhost:8080/gioppo"
// good
//let aut_url = "https://identity.micadoproject.eu/oauth2/authorize" + "?client_id=" + "6E6Gps3pfRJbzdrjxBiRYSNUVuoa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=http://localhost:8080/gioppo"
      let aut_url = "https://identity.micadoproject.eu/oauth2/authorize" + "?client_id=" + "6E6Gps3pfRJbzdrjxBiRYSNUVuoa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=https://migrants.micadoproject.eu/gioppo"

      // curl -X POST --basic -u "<client id>:<client secret>" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -k -d "token=<token to revoke>&token_type_hint=access_token" https://localhost:9443/oauth2/revoke

      console.log(aut_url)
      window.location = aut_url
*/
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
  }
}
</script>
