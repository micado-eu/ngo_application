/*
export function someMutation (state) {
}
*/
export function setSettings (state, settings) {
  if (settings) {
    state.settings = settings
  }
}
export function setMixedSettingMigrant(state, settings){
  state.mixed_settings_migrant = settings
}