import features from './data/features'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchFeatures () {
    return fetch(features, 1000) // wait 1s before returning posts
  }
}
