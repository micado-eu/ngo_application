export function glossary (state) {
  return state.glossary
}

export function glossaryProd (state) {
  return state.glossaryProd
}

export function glossaryElemByTitle (state) {
  let getterFunc = function (title) {
    return state.glossary.filter(g => g.title === title)[0]
  }
  return getterFunc
}

export function glossaryElemById (state) {
  let getterFunc = function (id) {
    return state.glossary.filter(g => g.id == id)[0]
  }
  return getterFunc
}

export function glossaryProdElemById (state) {
  let getterFunc = function (id) {
    return state.glossaryProd.filter(g => g.id == id)[0]
  }
  return getterFunc
}