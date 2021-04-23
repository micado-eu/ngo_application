import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchEvent() {
    return axiosInstance
      .get('/backend/1.0.0/events?filter[include][0][relation]=translations')
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  fetchEventProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/backend/1.0.0/production-events?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewEventItem(eventItem) {
    return axiosInstance
      .post('/backend/1.0.0/events', eventItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  addNewEventItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post(`/backend/1.0.0/events/${translation.id}/event-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  addNewEventItemTranslationProd(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post(`/backend/1.0.0/events/${translation.id}/event-translation-prods`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  editEventItem(newItem) {
    return axiosInstance
      .patch(`/backend/1.0.0/events/${newItem.id}`, newItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  editEventItemTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .patch(`/backend/1.0.0/events/${translation.id}/event-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteEventItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete(`/backend/1.0.0/events/${item.id}/event-translations`)
      // .then(
      //   () => axiosInstance.delete(`/backend/1.0.0/events/${item.id}/event-translation-prods`)
      // )
      .then(
        (response) => axiosInstance.delete(`/backend/1.0.0/events/${item.id}`)
      ).then((response) => response.data)
      .catch(error_handler)
  },
  deleteProdTranslations(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/events/${id}/event-translation-prods`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  setTopics(topics) {
    const promises = []
    for (let i = 0; i < topics.topics.length; i += 1) {
      const body = {
        idEvent: topics.id,
        idTopic: topics.topics[i].id
      }
      promises.push(axiosInstance.post(`/backend/1.0.0/events/${topics.id}/event-topics`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  setUserTypes(userTypes) {
    const promises = []
    for (let i = 0; i < userTypes.userTypes.length; i += 1) {
      const body = {
        idEvent: userTypes.id,
        idUserTypes: userTypes.userTypes[i].id
      }
      promises.push(axiosInstance.post(`/backend/1.0.0/events/${userTypes.id}/event-user-types`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  deleteTopics(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/events/${id}/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteUserTypes(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/events/${id}/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchEventTopics(id) {
    return axiosInstance
      .get(`/backend/1.0.0/events/${id}/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchEventUserTypes(id) {
    return axiosInstance
      .get(`/backend/1.0.0/events/${id}/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllEventTopics() {
    return axiosInstance
      .get(`/backend/1.0.0/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllEventUserTypes() {
    return axiosInstance
      .get(`/backend/1.0.0/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  updatePublished(id, is_published){
    return axiosInstance
    .patch('/backend/1.0.0/events?[where][id]='+ id, {published: is_published})
    .then(response => response.data)
    .catch(error_handler)
  }
}
