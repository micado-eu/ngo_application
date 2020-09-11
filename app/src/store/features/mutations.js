/*
export function someMutation (state) {
}
*/
export function setFeatures (state, features) {
  console.log("state setfeatures")
  console.log(features)
    if(features){
      state.features = features
    }
  }
