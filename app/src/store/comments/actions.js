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
export function fetchCommentsByTenant(state, tenant_id) {
  return client
    .fetchCommentsByTenant(tenant_id)
    .then(comments => state.commit('setComments', comments))
}

export function editComments (state, payload) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(payload.comment)
  // update translations
  return client
    .updateComment(payload.comment).then(function (update_return) {
      // cycle in the translations and update each
      console.log(update_return)
      console.log("in update translation")
      payload.comment.translations.forEach(function (aTranslation) {
        client.updateCommentTranslation(aTranslation).then(function (update_translation_return) {
          console.log(update_translation_return)
        })
      })
      
      state.commit('editComments', payload.comment)
    })
}

export function saveComments (state, payload) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions save comment:")
  console.log(payload.comment)
  let savingComment= JSON.parse(JSON.stringify(payload.comment, ['published', 'publicationdate', 'tenantId']));
  console.log(savingComment)
  var the_process = payload.process
  console.log(the_process)

  // we need to save first the topic
   client.saveComment(savingComment)
    .then(function (comment_return) {
      console.log("returned from saving comment")
      console.log(comment_return)
      // in topic_return we have the ID that we need in the following cycle
      payload.comment.translations.forEach(function (transl) {
        client.saveCommentTranslation(transl, comment_return.id)
      }, comment_return.id)
      // here we need only to add the ID to the comment element since there are the tranlsations that in the comment_return are not present
      console.log("after foreach save translation")
      payload.comment.id = comment_return.id
      // now we need to set the id for all translations
      for (var i = 0; i < payload.comment.translations.length; i++) {
        payload.comment.translations[i].id =comment_return.id
      }
      client.saveProcessComment(comment_return.id, payload.comment.idProcess)
     
      state.commit('saveComments', payload.comment)
      if(the_process.comments == null){
        the_process.comments = [{idprocess : payload.process.id, idcomment : comment_return.id}]
        //
      }
      else{
        the_process.comments.push({idprocess : payload.process.id, idcomment : comment_return.id})
        console.log(the_process.comments)
      }

      state.commit('flows/editProcess', the_process, { root: true })
    }
      // here we cycle for all translations to save each one

    )
}


export function deleteComments (state, index) {
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
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
