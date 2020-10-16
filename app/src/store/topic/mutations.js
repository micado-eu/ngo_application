/*
export function someMutation (state) {
}
*/

export function setTopic(state, topic) {
  console.log("setting topics to state")
  state.topic = topic
}

export function editTopic(state, topic_element) {
  console.log("update the state")
  const index = state.topic.findIndex(item => item.id === topic_element.id);
  if (index !== -1) state.topic.splice(index, 1, topic_element);
}

export function saveTopic(state, topic_element) {
  console.log("save to the state")
  console.log(topic_element)

  state.topic.push(topic_element);
  console.log(state.topic)
}

export function deleteTopic(state, index){
  const idx = state.topic.findIndex(item => item.id === index);
  if (idx !== -1) state.topic.splice(idx, 1);
}
/*export function delete_document_type (state, document_typeId) {
  let document_types = state.document_type.filter(d => d.id != document_typeId)
  state.document_type = document_types
}*/
