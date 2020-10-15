import client from 'api-documents-client'

/*
export function someAction (context) {
}
*/
export function fetchDocuments (state, data) {
  return client
    .fetchDocuments()
    .then(flows => state.commit('setDocuments', flows))
}

export function saveDocument (state, payload) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions save document:")
  console.log(payload.id_intervention)
  console.log(payload.document)

  // we need to save first the topic
  return client.saveDocument(payload.document)
    .then(function (doc_return) {
      console.log("returned from saving topic")
      console.log(doc_return)
      var doc_return_id = doc_return.id
      console.log("looking at the returned id")
      console.log(doc_return_id)
      payload.document.id = doc_return_id
      console.log("assigned id to document")
      console.log(payload.document.id)
      // in topic_return we have the ID that we need in the following cycle
      for (var i = 0; i < payload.document.pictures.length; i++) {
        payload.document.pictures[i].order = i
        payload.document.pictures[i].docId = doc_return_id
        console.log("this is the picture i am saving")
        console.log(payload.document.pictures[i])
        client.saveDocumentPictures(payload.document.pictures[i], doc_return_id)
      }
      client.saveInterventionDocument(doc_return_id,payload.id_intervention)
      // here we need only to add the ID to the topic element since there are the tranlsations that in the topic_return are not present
      console.log("after saving the completion document")

    }
      // here we cycle for all translations to save each one

    )
}

