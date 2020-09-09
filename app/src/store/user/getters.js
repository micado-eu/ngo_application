/*
export function someGetter (state) {
}
*/
export function userByid (state) {
    return function (userId) {
        return state.user.filter(a_user => a_user.umId === userId)
    }
}