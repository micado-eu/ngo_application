export function setEvent(state, event) {
  for (let i = 0; i < event.length; i += 1) {
    if (event[i].translations) {
      for (let j = 0; j < event[i].translations.length; j += 1) {
        event[i].translations[j].title = event[i].translations[j].event
        delete event[i].translations[j].event
        if (event[i].translations[j].description.length > 0) {
          event[i].translations[j].description = JSON.parse(
            event[i].translations[j].description
          )
        }
      }
    }
  }
  state.event = event
}
