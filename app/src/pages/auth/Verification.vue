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


export default {
  name: 'Verification',
  data () {
    return {
      token: '',
      message: ''
    }
  },
  mounted () {
    this.verifyUser()
  },
  methods: {
    verifyUser () {

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
      console.log(access_token)
      let tenant = this.$migrant_tenant
      console.log("before fetching the user")
      client.fetchUser(id_token.sub, tenant)
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
    }
  }
}
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
