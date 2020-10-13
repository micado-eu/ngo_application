import { axiosInstance } from 'boot/axios'

function error_handler(error) {
  console.log("ERROR IN CALLING API MANAGER")
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
}

export default {
  fetchDocumentType() {
    return axiosInstance
      .get('/backend/1.0.0/document-types?filter[include][0][relation]=translations&filter[include][1][relation]=pictures')
      .then(response => response.data)
      .catch(error_handler);
  },
  saveDocumentType(doc) {
    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/document-types', doc)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveDocumentTypeTranslation(translation, id) {
    translation.id = id
    const savingTranslation = JSON.parse(JSON.stringify(translation, [ 'lang', 'document', 'description']));
    
    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/document-types/' + id + '/document-type-translations', savingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveDocumentTypePictures(pictures, id, order) {
    pictures.documentTypeId = id
    
    const savingPicture = JSON.parse(JSON.stringify(pictures, ['image', 'documentTypeId']));
    
    // create fake id here
    return axiosInstance
      .post('/backend/1.0.0/document-types/' + id + '/document-type-pictures', savingPicture)
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteDocumentTypePictures(id) {
    return axiosInstance
      .delete('/backend/1.0.0/document-types/' + id + '/document-type-pictures')
      .then(response => response.data)
      .catch(error_handler);
  },
  deleteDocumentTypeTranslation(id) {
    return axiosInstance
      .delete('/backend/1.0.0/document-types/' + id + '/document-type-translations')
      .then(response => response.data)
      .catch(error_handler);
  },

  deleteDocumentType(id) {
    return axiosInstance
      .delete('/backend/1.0.0/document-types/' + id)
      .then(response => response.data)
      .catch(error_handler);
  },
  updateDocumentType(doc) {
    const whereClause = {
      id: { eq: doc.id }
    },
     updatingDocumentType = (doc.publicationDate == null) ? JSON.parse(JSON.stringify(doc, ['id', 'icon', 'published'])) : doc

    return axiosInstance
      .patch('/backend/1.0.0/document-types?where=' + JSON.stringify(whereClause), updatingDocumentType)
      .then(response => response.data)
      .catch(error_handler);
  },

  updateDocumentTypeTranslation(translation) {
    const whereClause = {
      id: { eq: translation.id }, lang: { eq: translation.lang }
    },
     updatingTranslation = (translation.translationDate == null) ? JSON.parse(JSON.stringify(translation, ['lang', 'document', 'description'])) : translation

    return axiosInstance
      .patch('/backend/1.0.0/document-types/' + translation.id + '/document-type-translations?where=' + JSON.stringify(whereClause), updatingTranslation)
      .then(response => response.data)
      .catch(error_handler);
  },
  updateDocumentTypePictures(picture) {
    const whereClause = {
      documentTypeId: { eq: picture.id }
    },
     updatingDocumentTypePictures = JSON.parse(JSON.stringify(picture, ['image']));

    return axiosInstance
      .patch('/backend/1.0.0/document-types/' + picture.id + '/document-type-pictures?where=' + JSON.stringify(whereClause), updatingDocumentTypePictures)
      .then(response => response.data)
      .catch(error_handler);
  }
}

