import client from 'api-information_tags-client'

export function fetchInformationTags(state, data) {
  return client
    .fetchInformationTags()
    .then((information_tags) => state.commit('setTagsType', information_tags))
}

export function editTagsTypeElement(state, information_tags) {
  // update translations
  return client
    .updateInformationTags({ id: information_tags.id, link_integration_plan: information_tags.link_integration_plan }).then((update_return) => {
      // cycle in the translations and update each
      information_tags.translations.forEach((aTranslation) => {
        aTranslation.translationState = 0
        client.updateInformationTagsTranslation(aTranslation)
      })
      fetchInformationTags(state)
    })
}

export function saveInformationTags(state, informationTags) {
  const promises = []
  for (let i = 0; i < informationTags.length; i += 1) {
    promises.push(
      client.saveInformationTags(informationTags[i])
    )
  }
  return Promise.all(promises)
}

export function saveInformationTagsTranslation(state, tags) {
  const promises = []
  for (let i = 0; i < tags.length; i += 1) {
    promises.push(client.saveInformationTagsTranslation(tags[i]))
  }
  return Promise.all(promises)
}

export function deleteInformationTagsFromInformation(state, informationId) {
  client.deleteInformationTags(informationId).then(() => {
    fetchInformationTags(state)
  })
}
