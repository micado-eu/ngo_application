import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
    fetchInterventions () {
        console.log("sono il client di fetchInterventions")
        return axiosInstance
            .get('/backend/1.0.0/individual-intervention-plans-ngo')
            .then(response => response.data)
            .catch(error_handler);

    }
}