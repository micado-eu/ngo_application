import axios from 'axios'

export default {
  fetchServices () {
    return axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.data)
  }
}
