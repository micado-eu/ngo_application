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

export function setEventProd(state, events) {
  for (let i = 0; i < events.length; i++) {
    events[i].title = events[i]['event']
    delete events[i].event
  }
  state.eventProd = events.filter(t => t.translated)
}

export function setEventTemp(state, events) {
  for (let i = 0; i < events.length; i++) {
    events[i].title = events[i]['event']
    delete events[i].event
  }
  state.eventTemp = events.filter(t => !t.translated)
}

export function updatePublished(state, data) {
  let idx = state.event.findIndex((i) => i.id === data.id)
  if (idx !== -1) {
    state.event[idx].published = data.published
  }
}