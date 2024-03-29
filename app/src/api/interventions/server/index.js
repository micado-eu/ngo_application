import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
    fetchInterventions (lang, ngoTenantId) {
        console.log("sono il client di fetchInterventions")
        let filter = {}
        return axiosInstance
            .get('/individual-intervention-plans-ngo?lang=' + lang + '&tenantId=' + ngoTenantId)
            .then(response => response.data)
            .catch(error_handler);

    },
    editIntervention (id_plan, intervention) {
        console.log(id_plan)
        const whereClause = {
            id: { eq: intervention.id }
        },

            editingIntervention = JSON.parse(JSON.stringify(intervention, ['id', 'listId', 'completed', 'validationDate', 'validatingUserId']));

        return axiosInstance
            .patch('/individual-intervention-plans/' + id_plan + '/individual-intervention-plan-interventions?where=' + JSON.stringify(whereClause), editingIntervention)
            .then(response => response.data)
            .catch(error_handler);
    },
}