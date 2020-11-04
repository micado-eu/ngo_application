export function setEvent(state, event) {
  for (let i = 0; i < event.length; i += 1) {
    if (event[i].translations) {
      for (let j = 0; j < event[i].translations.length; j += 1) {
        event[i].translations[j].title = event[i].translations[j].event
        delete event[i].translations[j].event
      }
    }
  }
  state.event = event
}
