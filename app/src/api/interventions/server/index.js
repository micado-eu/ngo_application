import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
    fetchInterventions (ngoTenantId) {
        console.log("sono il client di fetchInterventions")
        let filter = {}
        return axiosInstance
            .get('/backend/1.0.0/individual-intervention-plans-ngo')
            .then(response => response.data)
            .catch(error_handler);

    },
    editIntervention (id_plan, intervention) {
        console.log(id_plan)
        const whereClause = {
            id: { eq: intervention.id }
        },

            editingIntervention = JSON.parse(JSON.stringify(intervention, ['id', 'listId', 'completed', 'validation_date', 'validating_user_id']));

        return axiosInstance
            .patch('/backend/1.0.0/individual-intervention-plans/' + id_plan + '/individual-intervention-plan-interventions?where=' + JSON.stringify(whereClause), editingIntervention)
            .then(response => response.data)
            .catch(error_handler);
    },
}