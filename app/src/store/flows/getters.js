export function processes(state) {
    return state.flows
  }

export function processesProd(state) {
  return state.flowsProd
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