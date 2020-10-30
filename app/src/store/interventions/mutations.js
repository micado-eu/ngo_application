/*
export function someMutation (state) {
}
*/
export function setInterventions (state, interventions) {
    if (interventions) {
        state.interventions = interventions
    }
}
export function editInterventions(state, interventions) {
    console.log("update the state")
    const index = state.interventions.findIndex(item => item.id === interventions.id);
    if (index !== -1) state.interventions.splice(index, 1, interventions);
    console.log(interventions)
    console.log(state.interventions)
  }
