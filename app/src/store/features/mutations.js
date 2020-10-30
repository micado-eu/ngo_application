/*
export function someMutation (state) {
}
*/
export function setFeaturesFlag (state, features) {
  console.log("state setFeaturesFlag")
  console.log(features)
  if (features) {
    state.featuresFlag = features
  }
}
