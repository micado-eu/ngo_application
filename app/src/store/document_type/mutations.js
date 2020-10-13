/*
export function someMutation (state) {
}
*/

export function setDocument_type (state, document_type) {
      state.document_type = document_type
    }


    export function editDocumentType(state, document_type) {
      console.log("update the state")
      const index = state.document_type.findIndex(item => item.id === document_type.id);
      if (index !== -1) state.document_type.splice(index, 1, document_type);
    }

export function saveDocumentType(state, data){
  state.document_type.push(data)
}

export function deleteDocumentType(state, id) {
  var index = state.document_type.findIndex(d => d.id == id);
  state.document_type.splice(index, 1);
  console.log("deleted document at place " + index)
}