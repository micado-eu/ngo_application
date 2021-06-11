import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {

  saveDocument (document) {
    console.log("call to save to DB")
    console.log(document)
    // create fake id here
    const savingDocument = JSON.parse(JSON.stringify(document, ['documentTypeId', 'validated', 'expirationDate', 'uploadedByMe', 'validatedByTenant', 'validatedByUser', 'userTenant', 'userId', 'validationDate','shareable']))

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
  },
  saveInterventionDocument(id_doc, id_intervention){
    console.log("call to save to completed intervention doc to DB")
    // create fake id here
    const savingDOc = {idDocument: id_doc, idIntervention: id_intervention}
    console.log("I am the completed document")
    console.log(savingDOc)


    return axiosInstance
      .post('/backend/1.0.0/completed-intervention-documents/' , savingDOc)
      .then(response => response.data)
      .catch(error_handler);
  }
}