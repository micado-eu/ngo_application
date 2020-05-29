/*
export function someMutation (state) {
}
*/
export function setFlows (state, flows) {
  state.flows = flows
}

export function setTheFlows (state, flows) {
  state.theFlow = flows
}

export function setNodePanelVisible (state, visible) {
  state.nodePanelVisible = visible
}

export function editProcess(state, process) {
  console.log("update the state")
  const index = state.flows.findIndex(item => item.id === process.id);
  if (index !== -1) state.flows.splice(index, 1, process);
}

export function saveProcess(state, data){
state.flows.push(data)
}

export function deleteProcess(state, process) {
var index = state.flows.findIndex(d => d.id == process.id);
state.flows.splice(index, 1);
console.log("deleted process at place " + index)
}