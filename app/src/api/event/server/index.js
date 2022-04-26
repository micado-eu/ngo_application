import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchEvent() {
    return axiosInstance
      .get('/events?filter[include][0][relation]=translations')
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  fetchEventProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/production-events?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchEventTemp(defaultLang, userLang) {
    return axiosInstance
      .get(`/temp-events?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewEventItem(eventItem) {
    return axiosInstance
      .post('/events', eventItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  addNewEventItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post(`/events/${translation.id}/event-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveEventTranslationProd(id) {
    return axiosInstance
      .get(`/events/to-production?id=${id}`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  editEventItem(newItem) {
    return axiosInstance
      .patch(`/events/${newItem.id}`, newItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  editEventItemTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }, translated: { eq: translation.translated }
    }
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .patch(`/events/${translation.id}/event-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteEventItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete(`/events/${item.id}/event-translations`)
      .then(
        () => axiosInstance.delete(`/events/${item.id}/event-translation-prods`)
      )
      .then(
        (response) => axiosInstance.delete(`/events/${item.id}`)
      ).then((response) => response.data)
      .catch(error_handler)
  },
  deleteProdTranslations(id) {
    return axiosInstance
      .delete(`/events/${id}/event-translation-prods`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  setTopics(topics) {
    const promises = []
    for (let i = 0; i < topics.topics.length; i += 1) {
      const body = {
        idEvent: topics.id,
        idTopic: topics.topics[i]
      }
      promises.push(axiosInstance.post(`/events/${topics.id}/event-topics`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  setUserTypes(userTypes) {
    const promises = []
    for (let i = 0; i < userTypes.userTypes.length; i += 1) {
      const body = {
        idEvent: userTypes.id,
        idUserTypes: userTypes.userTypes[i]
      }
      promises.push(axiosInstance.post(`/events/${userTypes.id}/event-user-types`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  deleteTopics(id) {
    return axiosInstance
      .delete(`/events/${id}/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteUserTypes(id) {
    return axiosInstance
      .delete(`/events/${id}/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchEventTopics(id) {
    return axiosInstance
      .get(`/events/${id}/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchEventUserTypes(id) {
    return axiosInstance
      .get(`/events/${id}/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllEventTopics() {
    return axiosInstance
      .get(`/event-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllEventUserTypes() {
    return axiosInstance
      .get(`/event-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  updatePublished(id, is_published) {
    return axiosInstance
      .patch('/events?[where][id]=' + id, { published: is_published })
      .then(response => response.data)
      .catch(error_handler)
  },
  deleteCategory(id) {
    return axiosInstance
      .delete(`/events/${id}/category`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  import(file) {
    let formData = new FormData()
    formData.append('file', file)
    let postHeaders = axiosInstance.defaults.headers
    postHeaders['Content-Type'] = 'multipart/form-data'
    return axiosInstance.post('/events/import',
      formData,
      {
        headers: postHeaders
      }
    )
    .then((response) => response.data)
    .catch(error_handler)
  },
  export(id) {
    return axiosInstance.get('/events/export?id=' + id)
    .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" })
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", blobUrl)
        link.setAttribute("download", `events-${id}.csv`)
        document.body.appendChild(link) // Required for FF

        link.click()
        URL.revokeObjectURL(blobUrl) // Required for FF
    })
    .catch(error_handler)
  }
}
