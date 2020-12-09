/*
export function someMutation (state) {
}
*/

export function setTenants (state, tenants) {
  state.tenants = tenants
}

export function saveTenants (state, tenants) {
  console.log("save to the state")
  console.log(tenants)

  state.tenants.push(tenants)
  console.log(state.tenants)
}

/*
export function editComments(state, comments) {
  console.log("update the state")
  const index = state.comments.findIndex(item => item.id === comments.id);
  if (index !== -1) state.comments.splice(index, 1, comments);
  console.log(comments)
  console.log(state.comments)
}


export function deleteComments(state, index){
  const idx = state.comments.findIndex(item => item.id === index);
  if (idx !== -1) state.comments.splice(idx, 1);
}

*/
/* export function delete_document_type (state, document_typeId) {
  let document_types = state.document_type.filter(d => d.id != document_typeId)
  state.document_type = document_types
} */
