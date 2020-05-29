import flows from './data/flows'
//import documents from './data/documents'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

export default {
  fetchFlows () {
    return fetch(flows, 1000) // wait 1s before returning posts
  },
  fetchDocuments () {
    return fetch(flows, 1000) // wait 1s before returning posts
  },
  updateProcess(process) {
    console.log("fake call to update DB")
    console.log(process)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(process)
      }, 0)
    })
  },
  deleteProcess(process) {
    console.log("fake call to delete DB")
    console.log(process)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(process)
      }, 0)
    })
  },
  saveProcess(process) {
    console.log("fake call to save to DB")
    console.log(process)
    // create fake id here
    process.id = 999
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(process)
      }, 0)
    })
  }
}

