export function setInformation(state, information) {
  for (let i = 0; i < information.length; i += 1) {
    if (information[i].translations) {
      for (let j = 0; j < information[i].translations.length; j += 1) {
        information[i].translations[j].title = information[i].translations[j].information
        delete information[i].translations[j].information
        if (information[i].translations[j].description.length > 0) {
          information[i].translations[j].description = JSON.parse(
            information[i].translations[j].description
          )
        }
      }
    }
  }
  state.information = information
}
