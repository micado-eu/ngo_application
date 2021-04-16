import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchGlossary() {
    return axiosInstance
      .get('/backend/1.0.0/glossaries?filter[include][0][relation]=translations')
      .then(
        response => response.data
      ).catch(error_handler);
  },
  fetchGlossaryProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/backend/1.0.0/production-glossary?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewGlossaryItem(glossaryItem) {
    return axiosInstance
      .post('/backend/1.0.0/glossaries', glossaryItem)
      .then(
        response => response.data
      ).catch(error_handler);
  },
  addNewGlossaryItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post('/backend/1.0.0/glossaries/' + translation.id + '/glossary-translations', translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  editGlossaryItem(newItem) {
    return axiosInstance
      .patch('/backend/1.0.0/glossaries/' + newItem.id, newItem)
      .then(
        response => response.data
      ).catch(error_handler);
  },
  editGlossaryItemTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    }
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .patch('/backend/1.0.0/glossaries/' + translation.id + '/glossary-translations?where=' + JSON.stringify(whereClause), translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteGlossaryItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete('/backend/1.0.0/glossaries/' + item.id + '/glossary-translations')
      .then(
        response => {
          return axiosInstance.delete('/backend/1.0.0/glossaries/' + item.id)
        }
      ).then(response => response.data)
      .catch(error_handler);
  }
}
