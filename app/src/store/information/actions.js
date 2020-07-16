import client from 'api-information-client'

export function fetchInformation(state, data) {
  return client
    .fetchEvents()
    .then(information => {
      return state.commit('setInformation', information)
    })
}

export function saveNewInformationItem(state, data) {
  return client
    .saveNewEventItem(data)
}

export function addNewInformationItemTranslation(state, data) {
  data.event = data['title'];
  delete data.title;
  return client
    .addNewEventItemTranslation(data)
}

export function editInformationItem(state, data) {
  data.event = data['title'];
  delete data.title;
  return client
    .editEventItemTranslation(data)
}

export function unpublishItem(state, data) {
  data.event = data['title']
  delete data.title
  return client.editEventItem(data)
}