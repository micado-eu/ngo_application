import client from 'api-features-client'
/*
export function someAction (context) {
}
*/
export function fetchFeatures (state, data) {
      return client
        .fetchFeatures()
        .then(features => state.commit('setFeatures', features))
    }
