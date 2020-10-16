export function eventTags(state) {
  return state.event_tags
}

export function eventTagsByEvent(state) {
  return function (eventId) {
    return state.event_tags.filter((tag) => tag.eventId === eventId)
  }
}
