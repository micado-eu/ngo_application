<template>
  <q-page
    v-cloak
    padding
  >
    <p>
      {{ message }}
    </p>
  </q-page>
</template>

<script>
import client from 'api-user-client'
import storeMappingMixin from '../../mixin/storeMappingMixin'


export default {
  name: 'Verification',
    mixins: [storeMappingMixin({
    getters: {
      tenants: 'tenant/tenants'
    }, actions: {
      fetchTenants: 'tenant/fetchTenants'
    }
  })],
  data () {
    return {
      token: '',
      message: ''
    }
  },
  mounted () {
    this.fetchTenants()
    .then((res_tenants) =>{
      console.log("before calling verify user")
      console.log(res_tenants)
      this.$router.push({name: 'home'})
    })
 //   this.verifyUser()
  },
  methods: {
    /*verifyUser (res_tenants) {

      const hashes = this.$route.hash.slice(this.$route.hash.indexOf('#') + 1).split('&');

      let identity_response = hashes.reduce((acc, hash) => {
        // eslint-disable-next-line
        const [key, val] = hash.split('=');
        console.log(key)
        return {
          ...acc,
          [key]: val
        };
      }, {});

      console.log(hashes)
      console.log(identity_response)
      // https://localhost:9443/oidc/logout?id_token_hint=<id_token>&post_logout_redirect_uri=<redirect URI>&state=<state>
      let id_token = JSON.parse(atob(identity_response.id_token.split('.')[1]));
      let access_token = identity_response.access_token

      console.log('pagina di validate')
      console.log(this.$route)
      console.log(id_token)
      // in the id_token we have the real.tenant that talls us from which tenant the user arrived.
      console.log(access_token)
      let the_tenant = res_tenants.filter((aTenant)=>{return (aTenant.tenantData != null ? aTenant.tenantData.umDomainName == id_token.realm.tenant : false)})[0]
      console.log("THE TENANT")
      console.log(the_tenant)
      id_token.umtenantid=the_tenant.id
      console.log("before fetching the user")
      client.fetchUserLogin(id_token.sub, the_tenant.id)
        .then(response => {
          console.log("response from getting internal user id")
          console.log(response)
          id_token.umid = response[0].umId
          this.$store.commit('auth/setUser', id_token)
          this.$store.dispatch('auth/setToken', {
            token: identity_response,
            rememberMe: false
          })
        })

      this.$store.commit('auth/setUser', id_token)
      this.$store.dispatch('auth/setToken', {
        token: identity_response,
        rememberMe: false
      })


      /*
            this.token = this.$route.query.token
      
            this.$auth.verify(this.token).then((response) => {
              this.message = this.$i18n.t('auth.verification=.verification_success')
            })
              .catch((error) => {
                if (error.response) {
                  if (error.response.status === 422) {
                    this.message = this.$i18n.t('auth.verification.verification_failed')
                  }
                }
                console.error(error)
              })
              */
                         

    //}
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
