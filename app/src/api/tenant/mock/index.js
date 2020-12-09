import comments from './data/comments'
//import documents from './data/documents'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchComments () {
    return fetch(comments, 1000) // wait 1s before returning posts
  }
}
