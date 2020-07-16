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
  }
}
