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
export function fetchMixedSettingsMigrant(store, data){
  return client.fetchMixedSettingsMigrant(data.defaultLang, data.userLang).then((ret)=>{
    console.log("I AM THE PRIVACY POLICY")
    console.log(ret)
    store.commit('setMixedSettingMigrant', ret)
    return ret
  })
}