import client from 'api-features-client'
/*
export function someAction (context) {
}
*/
export function fetchFeaturesFlags (state, data) {
  return client
    .fetchFeaturesFlags()
    .then(features => state.commit('setFeaturesFlag', features[0].features))
}
