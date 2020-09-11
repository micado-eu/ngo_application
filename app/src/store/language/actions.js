import client from 'api-language-client'

export function fetchActiveLanguages (state) {
  return client
    .fetchActiveLanguages()
    .then(languages => state.commit('setActiveLanguages', languages))
}

export function setLanguageActive(state, payload) {
  return client
    .setLanguage(payload)
    .then(newLanguage => state.commit('setLanguageActive', payload))
}
