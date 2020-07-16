import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchEvents() {
    return axiosInstance
      .get('/backend/1.0.0/events?filter[include][0][relation]=translations')
      .then(
        response => response.data
      ).catch(error_handler);
  },
  saveNewEventItem(eventItem) {
    return axiosInstance
      .post('/backend/1.0.0/events/unpublished', eventItem)
      .then(
        response => response.data
      ).catch(error_handler);
  },
  addNewEventItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post('/backend/1.0.0/events/' + translation.id + '/event-translations', translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  editEventItem(newItem) {
    return axiosInstance
      .patch('/backend/1.0.0/events/' + newItem.id + '/unpublished', newItem)
      .then(
        response => response.data
      ).catch(error_handler);
  },
  editEventItemTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .patch('/backend/1.0.0/events/' + translation.id + '/event-translations?where=' + JSON.stringify(whereClause), translation)
      .then(response => response.data)
      .catch(error_handler);
  },
}
