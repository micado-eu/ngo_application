import documents from './data/documents'
//import documents from './data/documents'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchDocuments () {
    return fetch(documents, 1000) // wait 1s before returning posts
  }
}
