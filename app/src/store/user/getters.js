/*
export function someGetter (state) {
}
*/
export function userByid (state) {
    return function (userId) {
        return state.user.filter(a_user => a_user.umId === userId)
    }
}
export function csoUserProfile (state) {
    console.log("aske for pa user profile")
    return state.csoUserProfile
  }