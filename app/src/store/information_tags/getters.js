export function informationTags(state) {
    return state.information_tags
}

export function informationTagsByEvent(state) {
    return function (eventId) {
        return state.information_tags.filter(tag => tag.eventId === eventId)
    }
}