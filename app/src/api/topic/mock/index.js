import topic from './data/topic'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchTopic() {
    return fetch(topic, 1000) // wait 1s before returning posts
  },
  updateTopic(topic) {
    console.log("fake call to update DB")
    console.log(topic)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(topic)
      }, 0)
    })
  },
  saveTopic(topic) {
    console.log("fake call to save to DB")
    console.log(topic)
    // create fake id here
    topic.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(topic)
      }, 0)
    })
  },
  deleteTopic(topic) {
    console.log("fake call to save to DB")
    console.log(topic)
    // create fake id here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(topic)
      }, 0)
    })
  }
}
