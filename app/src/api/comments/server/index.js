import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchComments() {
    return axiosInstance
      .get('/backend/1.0.0/comments?filter[include][0][relation]=translations')
      .then(response => { return response.data })
      .catch(error_handler);
  },
  fetchCommentsByTenant(tenant_id) {
    return axiosInstance
      .get('/backend/1.0.0/comments?filter[include][0][relation]=translations&filter[where][tenantId]=' + tenant_id)
      .then(response => { return response.data })
      .catch(error_handler);
  },
  saveComment (comment) {
    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/comments', comment)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveCommentTranslation (translation, id) {
    translation.id = id
    const savingTranslation = JSON.parse(JSON.stringify(translation, ['id', 'lang', 'comment']));

    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/comments/' + id + '/comments-translations', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveProcessComment (comment_id, id) {
    const savingTranslation = { idprocess: id, idcomment: comment_id }

    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/processes/' + id + '/process-comments', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteCommentTranslations (id) {
    return axiosInstance
      .delete('/backend/1.0.0/comments/' + id + '/comments-translations')
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteComment (id) {
    return axiosInstance
      .delete('/backend/1.0.0/comments/' + id)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateComment (comment) {
    const whereClause = {
      id: { eq: comment.id }
    },
      updatingTopic = JSON.parse(JSON.stringify(comment, ['id','tenantId']))

    return axiosInstance
      .patch('/backend/1.0.0/comments?where=' + JSON.stringify(whereClause), updatingTopic)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateCommentTranslation (translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    },
      updatingTranslation = (translation.translationDate == null) ? JSON.parse(JSON.stringify(translation, ['id', 'lang', 'comment'])) : translation

    return axiosInstance
      .patch('/backend/1.0.0/comments/' + translation.id + '/comments-translations?where=' + JSON.stringify(whereClause), updatingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  }
}
