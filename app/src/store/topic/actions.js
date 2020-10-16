import client from 'api-topic-client'

/*
export function someAction (context) {
}
*/
export function fetchTopic (state, data) {
  console.log("fetching topics")
  return client
    .fetchTopic()
    .then(topic => {
      state.commit('setTopic', topic)
      return topic
    })
}

export function editTopic (state, topic_element) {
  // we need BEFORE to call the API to do the update and if ok we update wuex state
  console.log(topic_element)
  // update translations
  return client
    .updateTopic(topic_element).then(function (update_return) {
      // cycle in the translations and update each
      console.log(update_return)
      topic_element.translations.forEach(function (aTranslation) {
        client.updateTopicTranslation(aTranslation).then(function (update_translation_return) {
          console.log(update_translation_return)
        })
      })
      state.commit('editTopic', topic_element)
    })
  // update topic
  /*
  return client
    .updateTopic(topic_element)
    .then(topic_return => state.commit('editTopic', topic_return))
    */
}

export function saveTopic (state, topic_element) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log("in actions saveTopic:")
  console.log(topic_element)
  let savingTopic = JSON.parse(JSON.stringify(topic_element, ['icon', 'published']));
  console.log(savingTopic)


  // we need to save first the topic
  return client.saveTopic(savingTopic)
    .then(function (topic_return) {
      console.log("returned from saving topic")
      console.log(topic_return)
      // in topic_return we have the ID that we need in the following cycle
      topic_element.translations.forEach(function (transl) {
        client.saveTopicTranslation(transl, topic_return.id)
      }, topic_return.id)
      // here we need only to add the ID to the topic element since there are the tranlsations that in the topic_return are not present
      console.log("after foreach save translation")
      topic_element.id = topic_return.id
      // now we need to set the id for all translations
      for (var i = 0; i < topic_element.translations.length; i++) {
        topic_element.translations[i].id = topic_return.id
      }
      state.commit('saveTopic', topic_element)
    }
      // here we cycle for all translations to save each one

    )

  /*
    return client
      .saveTopic(topic_element)
      .then(topic_return => state.commit('saveTopic', topic_return))
      */
}

export function deleteTopic (state, index) {
  // we need BEFORE to call the API to do the save and if ok we update wuex state
  console.log(index)
  return client.deleteTopicTranslations(index).then(function (translations_delete_return) {
    console.log("deleted the translations")
    console.log(translations_delete_return)
    client.deleteTopic(index).then(function () {
      state.commit('deleteTopic', index)
    })
  })
  /*
  return client
    .deleteTopic(topic_element)
    .then(topic_return => state.commit('deleteTopic', topic_return))
    */
}


/*export function deleteDocument({commit}, document_type) {

  commit(delete_document_type, document_type.id)
} */