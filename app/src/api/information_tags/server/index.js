import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchInformationTags() {
    return axiosInstance
      .get('/backend/1.0.0/information-tags?filter[include][0][relation]=translations')
      .then((response) => response.data)
      .catch(error_handler)
  },
  updateInformationTags(information_tags) {
    return axiosInstance
      .patch(`/backend/1.0.0/information-tags/${information_tags.id}`, information_tags)
      .then((response) => response.data)
      .catch(error_handler)
  },

  updateInformationTagsTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    return axiosInstance
      .patch(`/backend/1.0.0/information-tags/${translation.id}/information-tag-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },

  saveInformationTags(information_tags) {
    return axiosInstance
      .post('/backend/1.0.0/information-tags', information_tags)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveInformationTagsTranslation(translation) {
    const { id } = translation
    delete translation.id
    return axiosInstance
      .post(`/backend/1.0.0/information-tags/${id}/information-tag-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteInformationTags(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/information/${id}/information-tags`)
      .then((response) => response.data)
      .catch(error_handler)
  }
}
