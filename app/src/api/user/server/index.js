import { axiosInstance } from 'boot/axios'
import { error_handler } from '../../../helper/utility'

export default {
  fetchUser (userlist) {
    console.log("sono il client di fetchUsers:" + userlist)
    let filter = { id: { inq: userlist } }
    let url = '/users?where=' + JSON.stringify(filter)
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
  fetchSpecificUser (tenant, id) {
    console.log(tenant)
    return axiosInstance
      .get(`/users/${id}?filter[include][0][relation]=attributes&filter[include][1][relation]=interventionPlans&filter[include][2][relation]=tenant&filter[include][3][relation]=userPicture&filter[include][4][relation]=userConsent`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchKeycloakMigrantUser(){
    return axiosInstance
      .get(`/getMigrantUserList`)
      .then((response) => response.data)
      .catch(error_handler)
},
  fetchUserLogin (username, tenant) {
    console.log(username, tenant)
    return axiosInstance
      .get('/users?filter[include][0][relation]=attributes&filter[include][1][relation]=interventionPlans&filter[where][and][0][umUserName][eq]=' + username + '&filter[where][and][1][umTenantId]=' + tenant)
      .then(response => { return response.data })
      .catch(error_handler);
  },
     saveUserPicture(picture){
    const workingPic= JSON.parse(JSON.stringify(picture, ['picture', 'userId', 'tenantId']))
    return axiosInstance
      .post('/user-pictures', workingPic)
      .then(response => { return response.data })
      .catch(error_handler);
  },
  editUserPicture(pic, id){
    return axiosInstance
      .patch('/user-pictures/' + id, {picture:pic})
      .then(response => { return response.data })
      .catch(error_handler);
  },
  editUserData(userid, firstName, lastName, email, phoneNumber){
    return axiosInstance
      .put('/updateUser?userid='+ userid + '&firstName=' + firstName + '&lastName=' + lastName + '&email=' + email +'&phone_number=' + phoneNumber +'&realm=ngo')
      .then(response => { return response.data })
      .catch(error_handler)
  },
  fetchCSOUserProfile(id){
    return axiosInstance
    .get(`/users/${id}?filter[include][0][relation]=userPicture`)
    .then((response) => response.data)
    .catch(error_handler)
  },
  editUserPassword(userid, password){
    return axiosInstance
    .put('/updateUserPassword?userid=' +userid + '&realm=ngo&password=' + password)
    .then(response => { return response.data })
    .catch(error_handler)
  },
  saveCSOUser(user, roles, tenant, token){
    return axiosInstance
      .post('/wso2UserComplete?username=' + user.username + '&password=' + user.password + '&name=' + user.givenName+ '&surname=' + user.familyName + '&email=' + user.email + '&roles=' + roles + '&tenant=' + tenant + '&authType=Bearer&authToken=' + token)
      .then(response => { return response.data })
      .catch(error_handler);
  },
  fetchUserGroup(user, token, tenant){
    return axiosInstance
    .get('/wso2UserRoles?user=' +user + '&tenant=' + tenant + '&authType=Bearer&authToken=' + token)
    .then((response) => response.data)
    .catch(error_handler)
  },
  editUserDataByAdmin(user, tenant, token){
    return axiosInstance
      .patch('/updateUser?payload=' +user + '&tenant=' + tenant +'&authType=Bearer&authToken=' + token + '&isAdmin=1')
      .then(response => { return response.data })
      .catch(error_handler);
  },
  fetchCSOUser (tenant) {
    console.log(tenant)
    return axiosInstance
      .get(`getNgoUserList?group_name=${tenant}`)
      .then((response) => response.data)
      .catch(error_handler)
  },
  fetchUserPic(id){
    return axiosInstance
    .get('/user-pictures?filter[where][and][0][userId]=' + id)
    .then((response) => response.data)
    .catch(error_handler)
  }

}