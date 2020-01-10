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
