export function information(state) {
  return state.information
}

export function informationElemByTitle(state) {
  let getterFunc = function (title) {
    return state.information.filter(g => g.title === title)[0]
  }
  return getterFunc
}

export function informationElemById(state) {
  let getterFunc = function (id) {
    return state.information.filter(g => g.id == id)[0]
  }
  return getterFunc
}