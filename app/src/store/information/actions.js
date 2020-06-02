import client from 'api-information-client'

export function fetchInformation(state, data) {
  return client
    .fetchInformation()
    .then(information => state.commit('setInformation', information))
}

export function saveNewInformationItem(state, data) {
  return client
    .saveNewInformationItem(data)
    .then(informationItem => state.commit('addNewInformationItem', informationItem))
}

export function editInformationItem(state, data) {
  return client
    .editInformationItem(data)
    .then(informationItem => state.commit('editInformationItem', informationItem))
}