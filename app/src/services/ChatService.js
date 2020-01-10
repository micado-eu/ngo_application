import ChatbotRepository from './ChatbotRepository'
import jsonpAdapter from 'axios-jsonp'


export default {
    getWord (params) {
//      return ChatbotRepository().get('/wordwise/entries?limit=1&headword=' + params.word, { adapter: jsonpAdapter })
      return ChatbotRepository().post('/webhooks/rest/webhook', {"sender":"aziz10","message":"hi"})
    }
}
