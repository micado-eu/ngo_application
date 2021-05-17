import ngo_user from './data/ngo_user'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchUser() {
    return fetch(ngo_user, 1000) // wait 1s before returning posts
  },
  updateUser(user) {
    console.log("fake call to update DB")
    console.log(user)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user)
      }, 0)
    })
  },
  saveUser(user) {
    console.log("fake call to save to DB")
    console.log(user)
    // create fake id here
    user.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user)
      }, 0)
    })
  },
  deleteUser(user) {
    console.log("fake call to save to DB")
    console.log(user)
    // create fake id here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user)
      }, 0)
    })
  }
}
