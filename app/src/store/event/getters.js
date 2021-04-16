export function event(state) {
  return state.event
}

export function eventProd(state) {
  return state.eventProd
}

export function eventElemByTitle(state) {
  const getterFunc = function (title) {
    return state.event.filter((g) => g.title === title)[0]
  }
  return getterFunc
}

export function eventElemById(state) {
  const getterFunc = function (id) {
    return state.event.filter((g) => g.id == id)[0]
  }
  return getterFunc
}

export function eventProdElemById(state) {
  const getterFunc = function (id) {
    return state.eventProd.filter((g) => g.id == id)[0]
  }
  return getterFunc
}
