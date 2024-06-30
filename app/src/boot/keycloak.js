import VueKeyCloak from '@dsb-norge/vue-keycloak-js'

export default async ({ Vue, router, store, app }) => {
  async function tokenInterceptor() {
    Vue.prototype.$axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
      return config
    }, error => {
      return Promise.reject(error)
    })
  }

  let keyPromise = null
  //const realm = store.getters['example/getRealm']
  //const the_store = store
  //if (realm !== null) {
    console.log('Esiste il realm')
    //console.log(realm)
    console.log("NGO*****************")
    keyPromise = new Promise(resolve => {
      Vue.use(VueKeyCloak, {
        init: {
          onLoad: 'check-sso', // or 'check-sso'
          //flow: 'standard',
          //pkceMethod: 'S256',
          //silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
          checkLoginIframe: false // otherwise it would reload the window every so seconds
        },
        config: {
          url: 'https://'+ Vue.prototype.$envconfig.identityUrl,
          realm: 'ngo',
          clientId: 'ngo_app'
        },
        onReady: (keycloak) => {
          console.log('onReady passed')
          console.log(keycloak)
          console.log(store)
          if(keycloak.authenticated){
            window.accessToken= keycloak.token
            console.log("I'm authenticated")
            var base64Url = keycloak.token.split('.')[1]
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
            console.log(JSON.parse(jsonPayload))
            //store.commit('auth/setUserKeycloak', JSON.parse(jsonPayload))
            store.commit('auth/setUserKeycloak', JSON.parse(jsonPayload))
            //console.log(store.auth.user)
          }
          else{
            store.commit('auth/setUserKeycloak', null)
          }
          console.log("before token interceptor")
          tokenInterceptor()
          console.log(Vue)

          resolve()
        },
        onAuthRefreshError: (keycloak) =>{
          console.log("refresh token expired")
          store.commit('auth/setUserKeycloak', null)
          keycloak.logout()
        },
        onInitError: (error) => {
          console.log('we have an error')
          console.log(error)
        }
      })
    })
  //}

  return keyPromise
}



/*

const initOptions = {
  url: 'http://127.0.0.1:8080/', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
}

const keycloak = Keycloak(initOptions)

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload()
  } else {
    Vue.$log.info('Authenticated')

    new Vue({
      el: '#app',
      render: h => h(App, { props: { keycloak: keycloak } })
    })
  }

  // Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        Vue.$log.info('Token refreshed' + refreshed)
      } else {
        Vue.$log.warn('Token not refreshed, valid for ' +
            Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds')
      }
    }).catch(() => {
      Vue.$log.error('Failed to refresh token')
    })
  }, 6000)
}).catch(() => {
  Vue.$log.error('Authenticated Failed')
})
*/
