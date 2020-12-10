import client from 'api-tenant-client'

/*
export function someAction (context) {
}
*/
export function fetchTenants (state, data) {
  return client
    .fetchTenants()
    .then((tenants) => {
      state.commit('setTenants', tenants)
      return tenants
    })
}

