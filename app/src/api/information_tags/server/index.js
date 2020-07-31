import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'


export default {
  fetchInformationTags() {
    return axiosInstance
      .get('/backend/1.0.0/event-tags?filter[include][0][relation]=translations')
      .then(response => { return response.data })
      .catch(error_handler);
  },
  updateInformationTags(information_tags) {
    return axiosInstance
      .patch('/backend/1.0.0/event-tags/' + information_tags.id, information_tags)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateInformationTagsTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    return axiosInstance
      .patch('/backend/1.0.0/event-tags/' + translation.id + '/event-tag-translations?where=' + JSON.stringify(whereClause), translation)
      .then(response => response.data)
      .catch(error_handler);
  },

  saveInformationTags(information_tags) {
    return axiosInstance
      .post('/backend/1.0.0/event-tags', information_tags)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveInformationTagsTranslation(translation) {
    let id = translation.id
    delete translation.id
    return axiosInstance
      .post('/backend/1.0.0/event-tags/' + id + '/event-tag-translations', translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteInformationTags(id) {
    return axiosInstance
      .delete('/backend/1.0.0/events/' + id + "/event-tags")
      .then(response => response.data)
      .catch(error_handler);
  },
}
