export function user (state) {
  return state.user
}

export function token (state) {
  console.log("TOKEN GETTER")
  console.log(state)
  return state.token
}

export function loggedIn (state) {
  return state.user !== null
}

export const check = state => roles => {
  const user = state.user
  console.log("getter check")
  console.log(roles)
  if (user) {
    if (Array.isArray(roles) && roles.length) {
      for (let role of roles) {
        if ((user.realm_access.roles != null) && user.realm_access.roles.includes(role)) {
          console.log("returning true since it has the role")
          return true
        }
      }
    } else if (roles) {
      if ((user.realm_access.roles != null) && user.realm_access.roles.includes(roles)) {
        console.log("returning true since it has the role")
        return true
      }
    }
    console.log("returning false since it does not have the role")
    return false
  }
  console.log("returning false since user do not exist")
  return false
}

