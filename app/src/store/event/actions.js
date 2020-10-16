import client from 'api-event-client'

export function fetchEvent(state, data) {
  return client
    .fetchEvent()
    .then((event) => state.commit('setEvent', event))
}

export function saveNewEventItem(state, data) {
  return client
    .saveNewEventItem(data)
}

export function addNewEventItemTranslation(state, data) {
  data.event = data.title
  delete data.title
  data.translationState = 0
  return client
    .addNewEventItemTranslation(data)
}

export function editEventItem(state, data) {
  return client.editEventItem(data)
}

export function editEventItemTranslation(state, data) {
  data.event = data.title
  delete data.title
  data.translationState = 0
  return client
    .editEventItemTranslation(data)
}

export function deleteEventItem(state, data) {
  return client
    .deleteEventItem(data)
}

export function updatePublishEventItem(state, data) {
  return client
    .editEventItem(data)
}

export function setTopics(state, data) {
  return client.setTopics(data)
}

export function setUserTypes(state, data) {
  return client.setUserTypes(data)
}

export function deleteTopics(state, id) {
  return client.deleteTopics(id)
}

export function deleteUserTypes(state, id) {
  return client.deleteUserTypes(id)
}

export function fetchEventTopics(state, id) {
  return client
    .fetchEventTopics(id)
    .then((eventTopics) => eventTopics)
}

export function fetchEventUserTypes(state, id) {
  return client
    .fetchEventUserTypes(id)
    .then((eventUserTypes) => eventUserTypes)
}
