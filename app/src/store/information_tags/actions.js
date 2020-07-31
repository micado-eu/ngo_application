import client from 'api-information_tags-client'

export function fetchInformationTags(state, data) {
  return client
    .fetchInformationTags()
    .then(information_tags => state.commit('setTagsType', information_tags))
}

export function editTagsTypeElement(state, information_tags) {
  // update translations
  return client
    .updateInformationTags({ id: information_tags.id, link_integration_plan: information_tags.link_integration_plan }).then(function (update_return) {
      // cycle in the translations and update each
      information_tags.translations.forEach(function (aTranslation) {
        client.updateInformationTagsTranslation(aTranslation)
      })
      fetchInformationTags(state)
    })
}

export function saveInformationTags(state, information_tags) {
  let promises = []
  for (let tag of information_tags.tags) {
    promises.push(
      client.saveInformationTags({ eventId: information_tags.eventId }).then((newTag) => {
        return client.saveInformationTagsTranslation({
          id: newTag.id,
          ...tag
        })
      })
    )
  }
  return Promise.all(promises)
}


export function deleteInformationTagsFromEvent(state, eventId) {
  client.deleteInformationTags(eventId).then(function () {
    fetchInformationTags(state)
  })
}

