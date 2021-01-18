import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchUser (userlist) {
    console.log("sono il client di fetchUsers:" + userlist)
    let filter = { umId: { inq: userlist } }
    let url = '/backend/1.0.0/users?where=' + JSON.stringify(filter)
    console.log(url)
    return axiosInstance
      .get(url)
      .then(response => {
        console.log("response in user client")
        console.log(response)
        return response.data
      })
      .catch(error_handler);

  },
  fetchUserLogin (username, tenant) {
    console.log(username, tenant)
    return axiosInstance
      .get('/backend/1.0.0/users?filter[include][0][relation]=attributes&filter[include][1][relation]=interventionPlans&filter[where][and][0][umUserName][eq]=' + username + '&filter[where][and][1][umTenantId]=' + tenant + '&filter[fields]=umId')
      .then(response => { return response.data })
      .catch(error_handler);
  },
     saveUserPicture(picture){
    const workingPic= JSON.parse(JSON.stringify(picture, ['picture', 'userId', 'tenantId']))
    return axiosInstance
      .post('/backend/1.0.0/user-pictures', workingPic)
      .then(response => { return response.data })
      .catch(error_handler);
  },
  editUserPicture(pic, id){
    return axiosInstance
      .patch('/backend/1.0.0/user-pictures/' + id, {picture:pic})
      .then(response => { return response.data })
      .catch(error_handler);
  },
  editUserData(user, tenant, token){
    return axiosInstance
      .patch('/backend/1.0.0/updateUser?payload=' +user + '&tenant=' + tenant +'&authType=Bearer&authToken=' + token)
      .then(response => { return response.data })
      .catch(error_handler);
  },
  fetchCSOUserProfile(id){
    return axiosInstance
    .get(`/backend/1.0.0/users/${id}?filter[include][0][relation]=attributes&filter[include][1][relation]=interventionPlans&filter[include][2][relation]=tenant&filter[include][3][relation]=userPicture`)
    .then((response) => response.data)
    .catch(error_handler)
  }

}