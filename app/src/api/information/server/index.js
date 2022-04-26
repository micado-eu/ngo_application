import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchInformation() {
    return axiosInstance
      .get('/information?filter[include][0][relation]=translations')
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  fetchInformationProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/production-information?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchInformationTemp(defaultLang, userLang) {
    return axiosInstance
      .get(`/temp-information?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewInformationItem(eventItem) {
    return axiosInstance
      .post('/information', eventItem)
      .then(
        (response) => response.data
      ).catch(error_handler)
  },
  addNewInformationItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post(`/information/${translation.id}/information-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveInformationTranslationProd(id) {
    return axiosInstance
      .get(`/information/to-production?id=${id}`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  editInformationItem(newItem) {
    return axiosInstance
      .patch(`/information/${newItem.id}`, newItem)
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
      .patch(`/information/${translation.id}/information-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteInformationItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete(`/information/${item.id}/information-translations`)
      .then(
        () => axiosInstance.delete(`/information/${item.id}/information-translation-prods`)
      )
      .then(
        () => axiosInstance.delete(`/information/${item.id}`)
      ).then((response) => response.data)
      .catch(error_handler)
  },
  deleteProdTranslations(id) {
    return axiosInstance
      .delete(`/information/${id}/information-translation-prods`)
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
      promises.push(axiosInstance.post(`/information/${topics.id}/information-topics`, body).then((response) => response.data))
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
      promises.push(axiosInstance.post(`/information/${userTypes.id}/information-user-types`, body).then((response) => response.data))
    }
    return Promise.all(promises).catch(error_handler)
  },
  deleteTopics(id) {
    return axiosInstance
      .delete(`/information/${id}/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteUserTypes(id) {
    return axiosInstance
      .delete(`/information/${id}/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchInformationTopics(id) {
    return axiosInstance
      .get(`/information/${id}/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchInformationUserTypes(id) {
    return axiosInstance
      .get(`/information/${id}/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllInformationTopics() {
    return axiosInstance
      .get(`/information-topics`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchAllInformationUserTypes() {
    return axiosInstance
      .get(`/information-user-types`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  updatePublished(id, is_published) {
    return axiosInstance
      .patch('/information?[where][id]=' + id, { published: is_published })
      .then(response => response.data)
      .catch(error_handler)
  },
  deleteCategory(id) {
    return axiosInstance
      .delete(`/information/${id}/category`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  import(file) {
    let formData = new FormData()
    formData.append('file', file)
    let postHeaders = axiosInstance.defaults.headers
    postHeaders['Content-Type'] = 'multipart/form-data'
    return axiosInstance.post('/information/import',
      formData,
      {
        headers: postHeaders
      }
    )
    .then((response) => response.data)
    .catch(error_handler)
  },
  export(id) {
    return axiosInstance.get('/information/export?id=' + id)
    .then((response) => {
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" })
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", blobUrl)
      link.setAttribute("download", `information-${id}.csv`)
      document.body.appendChild(link) // Required for FF

      link.click()
      URL.revokeObjectURL(blobUrl) // Required for FF
    })
    .catch(error_handler)
  }
}
