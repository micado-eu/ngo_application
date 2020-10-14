import client from 'api-interventions-client'
/*
export function someAction (context) {
}
*/
export function fetchInterventions (state, data) {
    return client
        .fetchInterventions()
        .then(interventions => {
            console.log(interventions)
            state.commit('setInterventions', interventions)
            return interventions
        })
}

export function editIntervention (state, payload) {
    // we need BEFORE to call the API to do the update and if ok we update wuex state
    console.log(payload.intervention)
    return client
        .editIntervention(payload.plan, payload.intervention)
        .then(intervention_plan_return => { return intervention_plan_return })
}