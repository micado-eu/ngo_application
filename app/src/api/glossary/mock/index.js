import glossary from './data/glossary'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

let i = 99999999999

export default {
  fetchGlossary() {
    return fetch(glossary, 1000) // wait 1s before returning posts
  },
  saveNewGlossaryItem(glossaryItem) {
    let aux = Object.assign(glossaryItem, { id: i })
    i--
    return fetch(aux, 1000)
  },
  editGlossaryItem(newItem) {
    return fetch(newItem, 1000)
  },
  deleteGlossaryItem(item) {
    return fetch(item, 1000)
  }
}
