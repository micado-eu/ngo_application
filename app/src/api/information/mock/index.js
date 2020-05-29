import information from './data/information'

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, time)
  })
}

let i = 99999999999

export default {
  fetchInformation() {
    return fetch(information, 1000) // wait 1s before returning posts
  },
  saveNewInformationItem(informationItem) {
    let aux = Object.assign(informationItem, { id: i })
    i--
    return fetch(aux, 1000)
  },
  editInformationItem(newItem) {
    return fetch(newItem, 1000)
  },
  deleteInformationItem(item) {
    return fetch(item, 1000)
  }
}
