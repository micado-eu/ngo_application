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