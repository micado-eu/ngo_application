import client from 'api-event_tags-client'

export function fetchEventTags(state, data) {
  return client
    .fetchEventTags()
    .then((event_tags) => state.commit('setTagsType', event_tags))
}

export function editTagsTypeElement(state, event_tags) {
  // update translations
  return client
    .updateEventTags({ id: event_tags.id, link_integration_plan: event_tags.link_integration_plan }).then((update_return) => {
      // cycle in the translations and update each
      event_tags.translations.forEach((aTranslation) => {
        aTranslation.translationState = 0
        client.updateEventTagsTranslation(aTranslation)
      })
      fetchEventTags(state)
    })
}

export function saveEventTags(state, eventTags) {
  const promises = []
  for (let i = 0; i < eventTags.length; i += 1) {
    promises.push(
      client.saveEventTags(eventTags[i])
    )
  }
  return Promise.all(promises)
}

export function saveEventTagsTranslation(state, tags) {
  const promises = []
  for (let i = 0; i < tags.length; i += 1) {
    promises.push(client.saveEventTagsTranslation(tags[i]))
  }
  return Promise.all(promises)
}

export function deleteEventTagsFromEvent(state, eventId) {
  client.deleteEventTags(eventId).then(() => {
    fetchEventTags(state)
  })
}
