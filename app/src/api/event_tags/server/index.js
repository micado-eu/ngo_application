import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchEventTags() {
    return axiosInstance
      .get('/backend/1.0.0/event-tags?filter[include][0][relation]=translations')
      .then((response) => response.data)
      .catch(error_handler)
  },
  updateEventTags(event_tags) {
    return axiosInstance
      .patch(`/backend/1.0.0/event-tags/${event_tags.id}`, event_tags)
      .then((response) => response.data)
      .catch(error_handler)
  },

  updateEventTagsTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    return axiosInstance
      .patch(`/backend/1.0.0/event-tags/${translation.id}/event-tag-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },

  saveEventTags(event_tags) {
    return axiosInstance
      .post('/backend/1.0.0/event-tags', event_tags)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveEventTagsTranslation(translation) {
    const { id } = translation
    delete translation.id
    return axiosInstance
      .post(`/backend/1.0.0/event-tags/${id}/event-tag-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteEventTags(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/events/${id}/event-tags`)
      .then((response) => response.data)
      .catch(error_handler)
  }
}
