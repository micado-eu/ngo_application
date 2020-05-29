import axios from 'axios'

export default {
  fetchIntegrationCategory () {
    return axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.data)
  },
  updateIntegrationCategory(integration_category){

  }
}
