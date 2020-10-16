import client from 'api-user_type-client'

/*
export function someAction (context) {
}
*/
export function fetchUserType (state, data) {
  return client
    .fetchUserType()
    .then(user_type => {
      state.commit('setUserType', user_type)
      return user_type
    })
}
export function editUserType (state, user_type) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(user_type)
  // update translations
  return client
    .updateUserType(user_type).then(function (update_return) {
      // cycle in the translations and update each
      console.log(update_return)
      user_type.translations.forEach(function (aTranslation) {
        client.updateUserTypeTranslation(aTranslation).then(function (update_translation_return) {
          console.log(update_translation_return)
        })
      })
      state.commit('editUserType', user_type)
    })
 
}



export function saveUserType (state, user_type) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions save user type:")
  console.log(user_type)
  let savingUserType = JSON.parse(JSON.stringify(user_type, ['icon']));
  console.log(savingUserType)


  // we need to save first the user type
  return client.saveUserType(savingUserType)
    .then(function (user_type_return) {
      console.log("returned from saving user type")
      console.log(user_type_return)
      // in topic_return we have the ID that we need in the following cycle
      user_type.translations.forEach(function (transl) {
        client.saveUserTypeTranslation(transl, user_type_return.id)
      }, user_type_return.id)
      // here we need only to add the ID to the topic element since there are the tranlsations that in the topic_return are not present
      console.log("after foreach save translation")
      user_type.id = user_type_return.id
      // now we need to set the id for all translations
      for (var i = 0; i < user_type.translations.length; i++) {
        user_type.translations[i].id = user_type_return.id
      }
      state.commit('saveUserType', user_type)
    }
      // here we cycle for all translations to save each one

    )

}


export function deleteUserType (state, index) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(index)
  return client.deleteUserTypeTranslations(index).then(function (translations_delete_return) {
    console.log("deleted the translations")
    console.log(translations_delete_return)
    client.deleteUserType(index).then(function () {
      state.commit('deleteUserType', index)
    })
  })
}
