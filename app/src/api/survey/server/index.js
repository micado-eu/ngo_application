import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchSurvey () {
    return axiosInstance
      .get('/backend/1.0.0/surveys')
      .then(response => { return response.data })
      .catch(error_handler)
  },
  saveSurveyAnswer(surveyid, answer){
    return axiosInstance
      .post('/backend/1.0.0/surveys/' + surveyid + '/survey-answers', answer)
      .then(response => response.data)
      .catch(error_handler);
  },
  updateSurvey(survey){
    return axiosInstance
      .patch('/backend/1.0.0/surveys/' + survey.id, survey)
      .then(response => response.data)
      .catch(error_handler);
  },
  fetchNGOSurvey (id) {
    if(id == undefined){
      id = 0
    }
    return axiosInstance
      .get('/backend/1.0.0/specific-survey?destinationApp=2&userid=' + id)
      .then(response => { return response.data })
      .catch(error_handler)
  }
  
}
