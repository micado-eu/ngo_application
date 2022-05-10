/*
export function someGetter (state) {
}
*/
export function userByid (state) {
    return function (userId) {
        return state.user.filter(a_user => a_user.id === userId)
    }
}
export function csoUserProfile (state) {
    console.log("aske for pa user profile")
    return state.csoUserProfile
  }
  export function csouser (state) {
    return state.csouser
  }

  export function pic(state){
    console.log("I am user pic")
    console.log(state.userPic)
    return state.userPic
  }

  export function keycloakMigrantUser (state) {
    return state.keycloakMigrantUser
  }