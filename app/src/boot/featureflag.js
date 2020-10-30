//import Vue from 'vue'
import { featureFlippingDirective, featureFlippingGuard, isEnabled, setEnabledFeatures } from '../directive/FeatureFlip'

// We globally register our directive with Vue;
// Remember that all directives in Vue will start with 'v-'
// but that should not be part of your directive name
// https://vuejs.org/v2/guide/custom-directive.html
// 'my-directive' will be used as 'v-my-directive'

import client from 'api-features-client'


export default async ({ app, router, store, Vue }) => {



  //setEnabledFeatures(['FF1', 'FF2', 'FF3'])
  //setEnabledFeatures(await getFeaturesFromBackend('http://localhost:8081'))
  //console.log(isEnabled('FF1'))
  //Vue.directive('feature-flag', featureFlippingDirective)

  Vue.directive('feature-flipping', featureFlippingDirective)
  Vue.mixin({ beforeRouteEnter: featureFlippingGuard })

  console.log("siamo in FEATURE flag boot")
  console.log(Vue)

  await store.dispatch('features/fetchFeaturesFlags')
  //   .then()
  console.log("before enabledfeatures")
  setEnabledFeatures(store.state.features.featuresFlag)
}
