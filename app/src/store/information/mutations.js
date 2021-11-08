export function setInformation(state, information) {
  for (let i = 0; i < information.length; i += 1) {
    if (information[i].translations) {
      for (let j = 0; j < information[i].translations.length; j += 1) {
        information[i].translations[j].title = information[i].translations[j].information
        delete information[i].translations[j].information
      }
    }
  }
  state.information = information
}

export function setInformationProd(state, information) {
  for (let i = 0; i < information.length; i++) {
    information[i].title = information[i]['information']
    delete information[i].information
  }
  state.informationProd = information.filter(t => t.translated)
}

export function setInformationTemp(state, information) {
  for (let i = 0; i < information.length; i++) {
    information[i].title = information[i]['information']
    delete information[i].information
  }
  state.informationTemp = information.filter(t => !t.translated)
}

export function updatePublished(state, data) {
  let idx = state.information.findIndex((i) => i.id === data.id)
  if (idx !== -1) {
    state.information[idx].published = data.published
  }
}