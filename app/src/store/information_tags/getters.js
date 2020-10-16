export function informationTags(state) {
  return state.information_tags
}

export function informationTagsByInformation(state) {
  return function (informationId) {
    return state.information_tags.filter((tag) => tag.informationId === informationId)
  }
}
