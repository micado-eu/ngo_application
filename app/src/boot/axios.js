import axios from 'axios'
import qs from 'qs'

const axiosInstance = axios.create({
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, {arrayFormat: 'repeat'})
  },
  baseURL: '',
  headers: {
    Prefer: 'resolution=merge-duplicates'
  }
})

export default ({ Vue }) => {
  console.log(Vue.prototype.$envconfig)
  console.log("before axiosinstance")
  // Here we add the apiKey that we got from the HTTP call
  axiosInstance.defaults.baseURL = 'https://' + Vue.prototype.$envconfig.apiUrl
  //axiosInstance.defaults.headers.common['apikey'] = Vue.prototype.$envconfig.apiKey
  Vue.prototype.$axios = axiosInstance
}

export { axiosInstance }

export const getCancelTokenSource = () => {
  return axios.CancelToken.source()
}

export const isCancel = thrown => {
  return axios.isCancel(thrown)
}
