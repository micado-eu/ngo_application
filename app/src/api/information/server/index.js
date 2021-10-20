import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchInformation() {
    return axiosInstance
      .get('/backend/1.0.0/information?filter[include][0][relation]=translations')
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  fetchInformationProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/backend/1.0.0/production-information?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchInformationTemp(defaultLang, userLang) {
    return axiosInstance
      .get(`/backend/1.0.0/temp-information?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewInformationItem(eventItem) {
    return axiosInstance
      .post('/backend/1.0.0/information', eventItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  addNewInformationItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post(`/backend/1.0.0/information/${translation.id}/information-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveInformationTranslationProd(id) {
    return axiosInstance
      .get(`/backend/1.0.0/information/to-production?id=${id}`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  editInformationItem(newItem) {
    return axiosInstance
      .patch(`/backend/1.0.0/information/${newItem.id}`, newItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  editInformationItemTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }, translated: { eq: translation.translated }
    }
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .patch(`/backend/1.0.0/information/${translation.id}/information-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteInformationItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete(`/backend/1.0.0/information/${item.id}/information-translations`)
      .then(
        () => axiosInstance.delete(`/backend/1.0.0/information/${item.id}/information-translation-prods`)
      )
      .then(
        () => axiosInstance.delete(`/backend/1.0.0/information/${item.id}`)
      ).then((response) => response.data)
      .catch(error_handler)
  },
  deleteProdTranslations(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/information/${id}/information-translation-prods`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  setTopics(topics) {
    const promises = []
    for (let i = 0; i < topics.topics.length; i += 1) {
      const body = {
        idInformation: topics.id,
        idTopic: topics.topics[i]
      }
      promises.push(axiosInstance.post(`/backend/1.0.0/information/${topics.id}/information-topics`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  setUserTypes(userTypes) {
    const promises = []
    for (let i = 0; i < userTypes.userTypes.length; i += 1) {
      const body = {
        idInformation: userTypes.id,
        idUserTypes: userTypes.userTypes[i]
      }
      promises.push(axiosInstance.post(`/backend/1.0.0/information/${userTypes.id}/information-user-types`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  deleteTopics(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/information/${id}/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteUserTypes(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/information/${id}/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchInformationTopics(id) {
    return axiosInstance
      .get(`/backend/1.0.0/information/${id}/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchInformationUserTypes(id) {
    return axiosInstance
      .get(`/backend/1.0.0/information/${id}/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllInformationTopics() {
    return axiosInstance
      .get(`/backend/1.0.0/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllInformationUserTypes() {
    return axiosInstance
      .get(`/backend/1.0.0/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  updatePublished(id, is_published) {
    return axiosInstance
      .patch('/backend/1.0.0/information?[where][id]=' + id, { published: is_published })
      .then(response => response.data)
      .catch(error_handler)
  },
  deleteCategory(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/information/${id}/category`)
      .then((response) => response.data)
      .catch(error_handler)
  }
}
