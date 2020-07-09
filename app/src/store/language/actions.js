import client from 'api-language-client'

export function fetchLanguages(state) {
  return client
    .fetchLanguages()
    .then(languages => state.commit('setLanguages', languages))
}

export function setLanguageActive(state, payload) {
  return client
    .setLanguage(payload)
    .then(newLanguage => state.commit('setLanguageActive', payload))
}