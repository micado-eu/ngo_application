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
  createUserDB(user){
    return axiosInstance
          .post('/users', user  )
          .then(response => { return response.data })
          .catch(error_handler)
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
  saveCSOUser(user, roles, group){
    return axiosInstance
      .post('createKeycloakUserWithRoleAndGroup?username=' + user.username + '&firstName=' + user.givenName + '&lastName=' + user.familyName + '&email=' + user.email + '&password=' + user.password + '&role=' + roles + '&realm=ngo&&group=' + group)
      .then(response => { return response.data })
      .catch(error_handler)
  },
  fetchUserGroup(userid){
    return axiosInstance
    .get('/getUserRoles?realm=ngo&userid=' +userid)
    .then((response) => response.data)
    .catch(error_handler)
  },
  editUserDataByAdmin(user){
    return axiosInstance
    .put('/updateUser?userid='+ user.userid + '&firstName=' + user.givenName + '&lastName=' + user.familyName + '&email=' + user.email+'&realm=ngo')
    .then(response => { return response.data })
    .catch(error_handler)
  },
  editUserRoles(userid, roles_to_add, roles_to_delete){
    return axiosInstance
      .post('/updateUserRoles?realm=ngo&userid='+ userid + '&roles_to_add=' + roles_to_add + '&roles_to_delete=' + roles_to_delete)
      .then(response => { return response.data })
      .catch(error_handler)
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