export function setInformation(state, information) {
  state.information = information
}

export function addNewInformationItem(state, informationItem) {
  state.information.push(informationItem)
}

export function editInformationItem(state, payload) {
  let elem = state.information.filter(g => g.id == payload.id)[0]
  let elemIndex = state.information.indexOf(elem)
  state.information[elemIndex] = payload
}

export function deleteInformationItem(state, informationItem) {
  let index = state.information.indexOf(informationItem)
  if (index !== -1) {
    state.information.splice(index, 1);
  }
}