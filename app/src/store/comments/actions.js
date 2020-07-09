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

export function editComment (state, comment) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(comment)
  // update translations
  return client
    .updateComment(comment).then(function (update_return) {
      // cycle in the translations and update each
      console.log(update_return)
      console.log("in update translation")
      comment.translations.forEach(function (aTranslation) {
        client.updateCommentTranslation(aTranslation).then(function (update_translation_return) {
          console.log(update_translation_return)
        })
      })
      state.commit('editComments', comment)
    })
}

export function saveComment (state, comment) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions save comment:")
  console.log(comment)
  let savingComment= JSON.parse(JSON.stringify(comment, ['published', 'publicationDate']));
  console.log(savingComment)


  // we need to save first the topic
  return client.saveComment(savingComment)
    .then(function (comment_return) {
      console.log("returned from saving comment")
      console.log(comment_return)
      // in topic_return we have the ID that we need in the following cycle
      comment.translations.forEach(function (transl) {
        client.saveIntegrationTypeTranslation(transl, comment_return.id)
      }, comment_return.id)
      // here we need only to add the ID to the comment element since there are the tranlsations that in the comment_return are not present
      console.log("after foreach save translation")
      comment.id = comment_return.id
      // now we need to set the id for all translations
      for (var i = 0; i < comment.translations.length; i++) {
        comment.translations[i].id =comment_return.id
      }
      state.commit('saveComments', comment)
    }
      // here we cycle for all translations to save each one

    )
}


export function deleteComment (state, index) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(index)
  return client.deleteCommentTranslations(index).then(function (translations_delete_return) {
    console.log("deleted the translations")
    console.log(translations_delete_return)
    client.deleteComment(index).then(function () {
      state.commit('deleteComments', index)
    })
  })
}