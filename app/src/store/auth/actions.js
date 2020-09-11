import { axiosInstance } from 'boot/axios'
import { Cookies } from 'quasar'

const REGISTER_ROUTE = '/auth/register'
const VERIFICATION_ROUTE = '/auth/verify'
const LOGIN_ROUTE = '/auth/login'
const FETCH_USER_ROUTE = '/auth/user'
const PASSWORD_FORGOT_ROUTE = '/auth/password/forgot'
const PASSWORD_RESET_ROUTE = '/auth/password/reset'

export function register (state, data) {
  return axiosInstance.post(REGISTER_ROUTE, data)
}

export function login (state, data) {
  console.log("before login")
  console.log(data)
  let d = new Date()
  let t = d.getTime()
  //  let aut_url = "https://identity.micadoproject.eu/oauth2/authorize" + "?client_id=" + "6E6Gps3pfRJbzdrjxBiRYSNUVuoa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=https://migrants.micadoproject.eu/gioppo"
  let aut_url = "https://identity.micadoproject.eu/oauth2/authorize" + "?client_id=" + "sfxTSKbY0BRjuEC5c5U3WvBYQVAa" + "&response_type=id_token token&scope=openid&nonce=" + t + "&redirect_uri=https://migrants.micadoproject.eu/verification"

  // curl -X POST --basic -u "<client id>:<client secret>" -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -k -d "token=<token to revoke>&token_type_hint=access_token" https://localhost:9443/oauth2/revoke

  console.log(aut_url)
  window.location = aut_url
  /*
  return new Promise(function (resolve, reject) {
    axiosInstance
      .post("https://localhost:9443/api/identity/auth/v1.1/authenticate", data.body, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
      .then(response => {
        console.log("received responsa from ID")
        console.log(response)
        // state.commit('setUser', response.data.user.data)
        const token = response.data.token
        axiosInstance.defaults.headers.common['Authorization'] =
          'Bearer ' + token
        state.dispatch('setToken', {
          token: token,
          rememberMe: data.rememberMe
        })
        return resolve()
      })
      .catch(error => {
        return reject(error)
      })
  })
*/
}

export function setToken (state, data) {
  /*
  axiosInstance.defaults.headers.common['Authorization'] =
    'Bearer ' + data.token
  if (data.rememberMe) {
    Cookies.set('authorization_token', data.token, {
      expires: 365
    })
  } else {
    Cookies.set('authorization_token', data.token)
  }
  */
  state.commit('setToken', data)
}

export function fetch (store) {
  console.log("in fetch")
  console.log(store)
  console.log(store.state.user)
  if (store.state.user) {
    console.log("found user")
    console.log(store.state.user)
    return true
  }
  /*
  var token = Cookies.get('authorization_token')
  console.log(token)
  if (token) {
    console.log("found token in cookies and fetching user")
    /*
    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
    return axiosInstance.get(FETCH_USER_ROUTE).then(response => {
      state.commit('setUser', response.data.data)
    })
    
  }
  */
}

export function logout (store) {
  console.log("LOGOUT ACTION")
  console.log(store)
  store.commit('setUser', null)
  //  let the_token = store.getters['auth/token']
  let the_token = store.state.token
  console.log(the_token)
  console.log("BEFORE COMPOSING URL")
  let aut_url = 'https://identity.micadoproject.eu/oidc/logout?id_token_hint=' + the_token.token.id_token + '&post_logout_redirect_uri=https://migrants.micadoproject.eu'
  store.commit('setToken', null)
  console.log(aut_url)
  window.location = aut_url
}

export function verify (state, token) {
  //  return axiosInstance.get(VERIFICATION_ROUTE + '?token=' + token)
  // TODO FIX THIS
  return true
}

export function passwordForgot (state, data) {
  return axiosInstance.post(PASSWORD_FORGOT_ROUTE, data)
}

export function passwordReset (state, { token, data }) {
  return axiosInstance.post(PASSWORD_RESET_ROUTE + '?token=' + token, data)
}
