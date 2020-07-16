import client from 'api-glossary-client'

export function fetchGlossary(state, data) {
  return client
    .fetchGlossary()
    .then(glossary => state.commit('setGlossary', glossary))
}