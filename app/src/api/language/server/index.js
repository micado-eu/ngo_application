import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'


export default {
    fetchActiveLanguages() {
        return axiosInstance
            .get('/backend/1.0.0/languages/active', {
            })
            .then((response) => {
                return response.data
            })
            .catch(error_handler);
    }
}
