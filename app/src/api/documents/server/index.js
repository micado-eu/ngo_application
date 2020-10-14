import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {

  saveDocument (document) {
    console.log("call to save to DB")
    console.log(document)
    // create fake id here
    const savingDocument = JSON.parse(JSON.stringify(document, ['documentTypeId', 'validated', 'expirationDate', 'uploadedByMe', 'validatedByTenant', 'validatedByUser', 'userTenant', 'userId', 'validationDate']))

    return axiosInstance
      .post('/backend/1.0.0/documents', savingDocument)
      .then(response => response.data)
      .catch(error_handler);
  },
  saveDocumentPictures (pictures, doc_id) {
    console.log("call to save to DB")
    console.log(process)
    // create fake id here
    const savingPicture = JSON.parse(JSON.stringify(pictures, ['docId', 'picture', 'order']))

    return axiosInstance
      .post('/backend/1.0.0/documents/' + doc_id + '/document-pictures', savingPicture)
      .then(response => response.data)
      .catch(error_handler);
  }
}