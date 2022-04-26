import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'


export default {
  fetchTopic () {
    return axiosInstance
      .get('/topics?filter[include][0][relation]=translations')
      .then(response => response.data)
      .catch(error_handler);
  },
  saveTopic (topic) {
    // create fake id here
    return axiosInstance
      .post('/topics', topic)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveTopicTranslation (translation, id) {
    translation.id = id
    const savingTranslation = JSON.parse(JSON.stringify(translation, ['id', 'lang', 'topic']));

    // create fake id here
    return axiosInstance
      .post('/topics/' + id + '/topic-translations', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteTopicTranslations (id) {
    return axiosInstance
      .delete('/topics/' + id + '/topic-translations')
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteTopic (id) {
    return axiosInstance
      .delete('/topics/' + id)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateTopic (topic) {
    const whereClause = {
      id: { eq: topic.id }
    },
      updatingTopic = JSON.parse(JSON.stringify(topic, ['id', 'icon']))

    return axiosInstance
      .patch('/topics?where=' + JSON.stringify(whereClause), updatingTopic)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateTopicTranslation (translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    },
      updatingTranslation = (translation.translationDate == null) ? JSON.parse(JSON.stringify(translation, ['id', 'lang', 'topic'])) : translation

    return axiosInstance
      .patch('/topics/' + translation.id + '/topic-translations?where=' + JSON.stringify(whereClause), updatingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  }
}
