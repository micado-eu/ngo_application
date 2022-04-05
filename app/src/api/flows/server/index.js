import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'


export default {
  fetchFlows () {
    return axiosInstance
      .get('/backend/1.0.0/processes?filter[include][0][relation]=translations&filter[include][1][relation]=processTopics&filter[include][2][relation]=applicableUsers&filter[include][3][relation]=comments&filter[where][and][0][published]=true')
      .then(response => { 
        console.log("I am the response from flow db")
        console.log(response.data)
        return response.data })
      .catch(error_handler);
  },
  fetchFlowsProd (defaultLang, userLang) {
    return axiosInstance
      .get('backend/1.0.0/processes-migrant?defaultlang=' + defaultLang + '&currentlang=' + userLang)
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchFlowsTemp (defaultLang, userLang) {
    return axiosInstance
      .get('backend/1.0.0/temp-processes-migrant?defaultlang=' + defaultLang + '&currentlang=' + userLang)
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchDocuments () {
    return fetch(flows, 1000) // wait 1s before returning posts
  },
  

  deleteProcessTranslations (id) {
    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id + '/process-translations')
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteProcess (id) {
    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteProcessTopic (id) {
    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id + '/process-topics')
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteProcessUser (id) {
    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id + '/process-users')
      .then(response => response.data)
      .catch(error_handler);
  },
  saveProcess (process) {
    console.log("call to save to DB")
    console.log(process)
    // create fake id here

    return axiosInstance
      .post('/backend/1.0.0/processes', process)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveProcessTranslation (translation, id) {
    translation.id = id
    const savingTranslation = JSON.parse(JSON.stringify(translation, ['id', 'lang', 'process', 'description']));

    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/processes/' + id + '/process-translations', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveProcessTopic (topic_id, id) {
    const savingTranslation = { idProcess: id, idTopic: topic_id }

    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/processes/' + id + '/process-topics', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveProcessUser (user_id, id) {
    const savingTranslation = { idProcess: id, idUserTypes: user_id }

    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/processes/' + id + '/process-users', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateProcess (process) {
    const whereClause = {
      id: { eq: process.id }
    },
      updatingProcess= (process.publicationDate == null) ? JSON.parse(JSON.stringify(process, ['id', 'link', 'published'])) : process

    return axiosInstance
      .patch('/backend/1.0.0/processes?where=' + JSON.stringify(whereClause), updatingProcess)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateProcessTranslation (translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    },
      updatingTranslation = (translation.translationDate == null) ? JSON.parse(JSON.stringify(translation, ['id', 'lang', 'prcess', 'description'])) : translation

    return axiosInstance
      .patch('/backend/1.0.0/processes/' + translation.id + '/process-translations?where=' + JSON.stringify(whereClause), updatingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteSingleProcessTopic (id, topic_id) {
    const whereClause = {
    idTopic: topic_id
    }

    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id + '/process-topics?where=' + JSON.stringify(whereClause))
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteSingleProcessUser (id, user_id) {
    const whereClause = {
    idUserTypes: user_id
    }

    return axiosInstance
      .delete('/backend/1.0.0/processes/' + id + '/process-users?where=' + JSON.stringify(whereClause))
      .then(response => response.data)
      .catch(error_handler);
  },
  fetchGraph (id, userLang) {
    return axiosInstance
      .get('backend/1.0.0/mermaid_pa?processid=' + id + '&lang=' + userLang)
      .then((response) => {
        return response.data
      })
      .catch(error_handler);
  }

}
