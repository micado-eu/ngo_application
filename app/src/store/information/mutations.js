export function setInformation(state, information) {
  for (let i = 0; i < information.length; i++) {
    if (information[i].translations) {
      for (let j = 0; j < information[i].translations.length; j++) {
        information[i].translations[j].title = information[i].translations[j]['event'];
        delete information[i].translations[j].event;
        information[i].translations[j].description = JSON.parse(information[i].translations[j].description)
      }
    }
  }
  state.information = information
}