import client from 'api-settings-client'
/*
export function someAction (context) {
}
*/
export function fetchSettings (state, data) {
  return client
    .fetchSettings()
    .then(settings => {
      state.commit('setSettings', settings)
      return settings
    })
}
