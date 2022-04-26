export function setUser (state, data) {
  if (data) {
    state.user = {
      id: data.sub,
      umid: data.umid,
      email: data.email,
      name: data.given_name,
      lastname: data.family_name,
      gender: data.gender,
      country: data.country,
      tenant: data.realm.tenant,
      tenant_id: data.umtenantid,
      roleNames: data.groups
    }
  } else {
    state.user = null
  }
}
export function setUserKeycloak (state, data) {
  state.user = data
}
export function setToken (state, data) {
  console.log("AUTH TOKEN MUTATION")
  console.log(data)
  if (data) {
    state.token = data
  } else {
    state.token = null
  }
}
