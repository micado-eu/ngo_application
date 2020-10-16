import client from 'api-event_category-client'

export function fetchEventCategory(state, data) {
  return client
    .fetchEventCategory()
    .then((event_category) => state.commit('setCategoryType', event_category))
}

export function editCategoryTypeElement(state, event_category) {
  // update translations
  return client
    .updateEventCategory({ id: event_category.id, link_integration_plan: event_category.link_integration_plan }).then((update_return) => {
      // cycle in the translations and update each
      event_category.translations.forEach((aTranslation) => {
        aTranslation.translationState = 0
        aTranslation.eventCategory = aTranslation.category
        delete aTranslation.category
        client.updateEventCategoryTranslation(aTranslation)
      })
      fetchEventCategory(state)
    })
}
export function saveEventCategory(state, event_category) {
  return client.saveEventCategory({ link_integration_plan: event_category.link_integration_plan })
    .then((category_return) => {
      // in topic_return we have the ID that we need in the following cycle
      event_category.translations.forEach((transl, idx) => {
        transl.translationState = 0
        transl.eventCategory = transl.category
        delete transl.category
        client.saveEventCategoryTranslation(transl, category_return.id).then(() => {
          if (idx === event_category.translations.length - 1) {
            fetchEventCategory(state)
          }
        })
      }, category_return.id)
    })
}

export function deleteEventCategory(state, index) {
  return client.deleteEventCategoryTranslations(index).then((translations_delete_return) => {
    client.deleteEventCategory(index).then(() => {
      fetchEventCategory(state)
    })
  })
}
