import timeseries from './data/timeseries'
import origin from './data/origin'
import migrants from './data/migrants'
import city_graphs from './data/city/graphs'
import categories from './data/city/categories'

export default {
  fetchStatistics() {
    return Promise.resolve({
      timeseries,
      origin,
      migrants,
      city_graphs,
      categories,
    })
  }
}