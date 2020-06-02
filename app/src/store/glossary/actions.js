import client from 'api-glossary-client'

export function fetchGlossary(state, data) {
  return client
    .fetchGlossary()
    .then(glossary => state.commit('setGlossary', glossary))
}

export function saveNewGlossaryItem(state, data) {
  return client
    .saveNewGlossaryItem(data)
    .then(glossaryItem => state.commit('addNewGlossaryItem', glossaryItem))
}

export function editGlossaryItem(state, data) {
  return client
    .editGlossaryItem(data)
    .then(glossaryItem => state.commit('editGlossaryItem', glossaryItem))
}

export function deleteGlossaryItem(state, data) {
  return client
    .deleteGlossaryItem(data)
    .then(() => state.commit('deleteGlossaryItem', data))
}