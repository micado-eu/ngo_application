import client from 'api-comments-client'

/*
export function someAction (context) {
}
*/
export function fetchComments(state, data) {
  return client
    .fetchComments()
    .then(comments => state.commit('setComments', comments))
}

export function editIntegrationTypeElement (state, integration_type_element) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(integration_type_element)
  // update translations
  return client
    .updateIntegrationType(integration_type_element).then(function (update_return) {
      // cycle in the translations and update each
      console.log(update_return)
      console.log("in update translation")
      integration_type_element.translations.forEach(function (aTranslation) {
        client.updateIntegrationTypeTranslation(aTranslation).then(function (update_translation_return) {
          console.log(update_translation_return)
        })
      })
      state.commit('editIntegrationTypeElement', integration_type_element)
    })
}

export function saveIntegrationTypeElement (state, integration_type_element) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions savec ategory:")
  console.log(integration_type_element)
  let savingCategory= JSON.parse(JSON.stringify(integration_type_element, ['published', 'publicationDate', 'categoryType']));
  console.log(savingCategory)


  // we need to save first the topic
  return client.saveIntegrationType(savingCategory)
    .then(function (type_return) {
      console.log("returned from saving category")
      console.log(type_return)
      // in topic_return we have the ID that we need in the following cycle
      integration_type_element.translations.forEach(function (transl) {
        client.saveIntegrationTypeTranslation(transl, type_return.id)
      }, type_return.id)
      // here we need only to add the ID to the topic element since there are the tranlsations that in the topic_return are not present
      console.log("after foreach save translation")
      integration_type_element.id = type_return.id
      // now we need to set the id for all translations
      for (var i = 0; i < integration_type_element.translations.length; i++) {
        integration_type_element.translations[i].id = type_return.id
      }
      state.commit('saveIntegrationTypeElement', integration_type_element)
    }
      // here we cycle for all translations to save each one

    )
}


export function deleteIntegrationTypeElement (state, index) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(index)
  return client.deleteIntegrationTypeTranslations(index).then(function (translations_delete_return) {
    console.log("deleted the translations")
    console.log(translations_delete_return)
    client.deleteIntegrationType(index).then(function () {
      state.commit('deleteIntegrationTypeElement', index)
    })
  })
}