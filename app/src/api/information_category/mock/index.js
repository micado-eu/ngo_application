import information_category from './data/information_category'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchInformationCategory() {
    return fetch(information_category, 1000) // wait 1s before returning posts
  },
  updateInformationCategory(information_category) {
    console.log("fake call to update DB")
    console.log(information_category)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(information_category)
      }, 0)
    })
  },
  saveInformationCategory(information_category) {
    console.log("fake call to save to DB")
    console.log(information_category)
    // create fake id here
    information_category.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(information_category)
      }, 0)
    })
  },
  deleteInformationCategory(information_category) {
    console.log("fake call to save to DB")
    console.log(information_category)
    // create fake id here
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(information_category)
      }, 0)
    })
  }
}
