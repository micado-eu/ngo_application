import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchEventCategory() {
    return axiosInstance
      .get('/backend/1.0.0/event-categories?filter[include][0][relation]=translations')
      .then((response) => response.data)
      .catch(error_handler)
  },
  updateEventCategory(event_category) {
    return axiosInstance
      .patch(`/backend/1.0.0/event-categories/${event_category.id}`, event_category)
      .then((response) => response.data)
      .catch(error_handler)
  },

  updateEventCategoryTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    return axiosInstance
      .patch(`/backend/1.0.0/event-categories/${translation.id}/event-category-translations?where=${JSON.stringify(whereClause)}`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },

  saveEventCategory(event_category) {
    return axiosInstance
      .post('/backend/1.0.0/event-categories', event_category)
      .then((response) => response.data)
      .catch(error_handler)
  },
  saveEventCategoryTranslation(translation, id) {
    translation.id = id

    return axiosInstance
      .post(`/backend/1.0.0/event-categories/${id}/event-category-translations`, translation)
      .then((response) => response.data)
      .catch(error_handler)
  },
  deleteEventCategoryTranslations(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/event-categories/${id}/event-category-translations`)
      .then((response) => response.data)
      .catch(error_handler)
  },

  deleteEventCategory(id) {
    return axiosInstance
      .delete(`/backend/1.0.0/event-categories/${id}`)
      .then((response) => response.data)
      .catch(error_handler)
  }
}
