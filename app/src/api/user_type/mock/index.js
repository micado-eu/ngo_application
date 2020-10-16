import user_type from './data/user_type'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchUserType() {
    return fetch(user_type, 1000) // wait 1s before returning posts
  },
  updateUserType(user_type) {
    console.log("fake call to update DB")
    console.log(user_type)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user_type)
      }, 0)
    })
  },
  saveUserType(user_type) {
    console.log("fake call to save to DB")
    console.log(user_type)
    // create fake id here
    user_type.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user_type)
      }, 0)
    })
  },
  deleteUserType(user_type) {
    console.log("fake call to save to DB")
    console.log(user_type)
    // create fake id here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user_type)
      }, 0)
    })
  }
}
