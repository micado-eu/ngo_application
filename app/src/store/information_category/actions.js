import client from 'api-information_category-client'

export function fetchInformationCategory(state, data) {
  return client
    .fetchInformationCategory()
    .then(information_category => state.commit('setCategoryType', information_category))
}

export function editCategoryTypeElement(state, information_category) {
  // update translations
  return client
    .updateInformationCategory({ id: information_category.id, link_integration_plan: information_category.link_integration_plan }).then(function (update_return) {
      // cycle in the translations and update each
      information_category.translations.forEach(function (aTranslation) {
        client.updateInformationCategoryTranslation(aTranslation)
      })
      fetchInformationCategory(state)
    })
}
export function saveInformationCategory(state, information_category) {
  return client.saveInformationCategory({ link_integration_plan: information_category.link_integration_plan })
    .then(function (category_return) {
      // in topic_return we have the ID that we need in the following cycle
      information_category.translations.forEach(function (transl, idx) {
        client.saveInformationCategoryTranslation(transl, category_return.id).then(() => {
          if (idx === information_category.translations.length - 1) {
            fetchInformationCategory(state)
          }
        })
      }, category_return.id)
    }
    )
}


export function deleteInformationCategory(state, index) {
  console.log(index)
  return client.deleteInformationCategoryTranslations(index).then(function (translations_delete_return) {
    client.deleteInformationCategory(index).then(function () {
      fetchInformationCategory(state)
    })
  })
}

