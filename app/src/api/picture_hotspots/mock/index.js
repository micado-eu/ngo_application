import document_type from './data/document_type'
//import documents from './data/documents'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchDocument_type () {
    return fetch(document_type, 1000) // wait 1s before returning posts
  }, 
  updateDocumentType(document_type) {
    console.log("fake call to save to DB")
    console.log(document_type)
    // create fake id here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(document_type)
      }, 0)
    })
  },
  saveDocumentType(document_type) {
    console.log("fake call to save to DB")
    console.log(document_type)
    // create fake id here
    document_type.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(document_type)
      }, 0)
    })
  }
}

