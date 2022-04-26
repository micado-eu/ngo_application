import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchGlossary() {
    return axiosInstance
      .get('/glossaries?filter[include][0][relation]=translations')
      .then(
        response => response.data
      ).catch(error_handler);
  },
  fetchGlossaryProd(defaultLang, userLang) {
    return axiosInstance
      .get(`/production-glossary?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  fetchGlossaryTemp(defaultLang, userLang) {
    return axiosInstance
      .get(`/temp-glossary?defaultlang=${defaultLang}&currentlang=${userLang}`, {
      })
      .then((response) => {
        return response.data
      })
      .catch(error_handler)
  },
  saveNewGlossaryItem(glossaryItem) {
    return axiosInstance
      .post('/glossaries', glossaryItem)
      .then(
        response => response.data
      ).catch(error_handler);
  },
  addNewGlossaryItemTranslation(translation) {
    if (!translation.translationDate) {
      translation.translationDate = new Date().toISOString()
    }
    return axiosInstance
      .post('/glossaries/' + translation.id + '/glossary-translations', translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  editGlossaryItem(newItem) {
    return axiosInstance
      .patch('/glossaries/' + newItem.id, newItem)
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
      .patch('/glossaries/' + translation.id + '/glossary-translations?where=' + JSON.stringify(whereClause), translation)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteGlossaryItem(item) {
    // Delete translations then item
    return axiosInstance
      .delete('/glossaries/' + item.id + '/glossary-translations')
      .then(
        response => {
          return axiosInstance.delete('/glossaries/' + item.id)
        }
      ).then(response => response.data)
      .catch(error_handler);
  }
}
