import client from 'api-flows-client'
/*
export function someAction (context) {
}
*/
export function fetchFlows (state, data) {
  return client
    .fetchFlows()
    .then(flows => {
      state.commit('setFlows', flows)
      return flows
    })
}

export function fetchFlowsProd (state, data) {
  return client
    .fetchFlowsProd(data.defaultLang, data.userLang)
    .then(flows => {
      state.commit('setFlowsProd', flows)
      return flows
    })
}

export function fetchFlowsTemp (state, data) {
  return client
    .fetchFlowsTemp(data.defaultLang, data.userLang)
    .then(flows => {
      state.commit('setFlowsTemp', flows)
      return flows
    })
}

export function fetchDocuments (state, data) {
  return client
    .fetchDocuments()
    .then(flows => state.commit('setDocuments', flows))
}

export function editProcess(state, process) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(process)
  return client
    .updateProcess(process)
    .then(process_return => state.commit('editProcess', process_return))
}

export function saveProcess(state, process) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(process)
  return client
    .saveProcess(process)
    .then(process_return => state.commit('saveProcess', process_return))
}

export function fetchGraph (state, payload) {
  return client
    .fetchGraph(payload.id, payload.userLang)
    .then(graph => {
      return graph
    })
}