import client from 'api-event-client'

export function fetchEvent(state, data) {
  return client
    .fetchEvent()
    .then((event) => state.commit('setEvent', event))
}

export function fetchEventProd(state, data) {
  return client
    .fetchEventProd(data.defaultLang, data.userLang)
    .then((event) => state.commit('setEventProd', event))
}

export function fetchEventTemp(state, data) {
  return client
    .fetchEventTemp(data.defaultLang, data.userLang)
    .then((event) => state.commit('setEventTemp', event))
}

export function saveNewEventItem(state, data) {
  return client
    .saveNewEventItem(data)
}

export function addNewEventItemTranslation(state, data) {
  data.event = data.title
  delete data.title
  return client
    .addNewEventItemTranslation(data)
}

export function editEventItem(state, data) {
  return client.editEventItem(data)
}

export function editEventItemTranslation(state, data) {
  data.event = data.title
  delete data.title
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

export function fetchAllEventTopics(state) {
  return client
    .fetchAllEventTopics()
    .then((eventTopics) => eventTopics)
}

export function fetchAllEventUserTypes(state) {
  return client
    .fetchAllEventUserTypes()
    .then((eventUserTypes) => eventUserTypes)
}

export function updatePublished(state, data) {
  return client
    .updatePublished(data.id, data.published)
    .then(() => {
      state.commit("updatePublished", data)
    })
}

export function deleteProdTranslations(state, id) {
  return client.deleteProdTranslations(id)
}

export function saveEventTranslationProd(state, id) {
  return client
    .saveEventTranslationProd(id)
}

export function deleteCategory(state, data) {
  return client.deleteCategory(data)
}

export function importData(state, file) {
  return client.import(file)
}

export function exportData(state, id) {
  return client.export(id)
}