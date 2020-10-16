/*
export function someMutation (state) {
}
*/

export function setUserType(state, user_type) {
  state.user_type = user_type
}

export function editUserType(state, user_type_element) {
  console.log("update the state")
  const index = state.user_type.findIndex(item => item.id === user_type_element.id);
  if (index !== -1) state.user_type.splice(index, 1, user_type_element);
}

export function saveUserType(state, user_type_element) {
  console.log("save to the state")
  console.log(user_type_element)

  state.user_type.push(user_type_element);
  console.log(state.user_type)
}

export function deleteUserType(state, index){
  const idx = state.user_type.findIndex(item => item.id === index);
  if (idx !== -1) state.user_type.splice(idx, 1);
}
/*export function delete_document_type (state, document_typeId) {
  let document_types = state.document_type.filter(d => d.id != document_typeId)
  state.document_type = document_types
}*/
