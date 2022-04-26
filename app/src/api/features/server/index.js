import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchFeaturesFlags () {
    console.log("sono il client di features")
    return axiosInstance
      .get('/active-features')
      .then(response => {
        console.log(response.data)
        return response.data
      })
      .catch(error_handler);
  },
}
