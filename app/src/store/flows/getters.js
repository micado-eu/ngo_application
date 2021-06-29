export function processes(state) {
    return state.flows
  }

export function processesProd(state) {
  return state.flowsProd
}

export function processesTemp(state) {
  return state.flowsTemp
}

export function graphList(state){
  return state.graphs
}

export function processProdById(state) {
  let getterFunc = function (id) {
    return state.flowsProd.filter(n => n.id == id)[0]
  }
  return getterFunc
}

export function processTempById(state) {
  let getterFunc = function (id) {
    return state.flowsTemp.filter(n => n.id == id)[0]
  }
  return getterFunc
}

export function flowsDocs(state) {
  return state.flowsDocs
}
export function processById(state) {
  let getterFunc = function (id) {
    let filtered = state.flows.filter(n => n.id == id)
    if (filtered.length < 1) throw 'Not found'
    return filtered[0]
  }
  return getterFunc
}
export function flowData(state) {
  return state.flowdata
}

export function shell_data(state) {
  return state.shell_data
}

export function nodePanelVisible(state) {
  return state.nodePanelVisible
}

  export function documents(state) {
    return state.documents
  }
