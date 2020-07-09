import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'


export default {
    fetchSettings () {
        return axiosInstance
            .get('/backend/1.0.0/settings')
            .then((response) => {
                return response.data
            })
            .catch(error_handler);
    }
}
