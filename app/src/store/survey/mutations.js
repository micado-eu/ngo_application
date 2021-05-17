/*
export function someMutation (state) {
}
*/

export function setSurvey (state, survey) {
  state.survey = survey
}

export function editSurvey (state, survey) {
  console.log("update the state")
  const index = state.survey.findIndex(item => item.id === survey.id);
  if (index !== -1) state.survey.splice(index, 1, survey);
}

export function saveSurvey (state, survey) {
  console.log("save to the state")
  console.log(survey)

  state.survey.push(survey);
  console.log(state.survey)
}

export function deleteSurvey (state, index) {
  const idx = state.survey.findIndex(item => item.id === index);
  if (idx !== -1) state.survey.splice(idx, 1);
}
/*export function delete_document_type (state, document_typeId) {
  let document_types = state.document_type.filter(d => d.id != document_typeId)
  state.document_type = document_types
}*/
