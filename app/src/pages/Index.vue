<template>
  <q-page class="col center">
    <div class="col">
      <img
        alt="Micado logo"
        src="~assets/micado-logo.png"
      >
      <div>
        CSO Application
      </div>
      <div class="h6">Build: {{buildDate}}</div>
    </div>
    <div
      class="h4"
      v-if="!this.$auth.loggedIn()"
    >To log in please press
      <q-btn
        @click="toLogin()"
        label="here"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    console.log("wrinting the build date")
    console.log(this.$envconfig.appBuildDate)
    console.log(new Date(this.$envconfig.appBuildDate))
    return {
      buildDate: new Date(this.$envconfig.appBuildDate)
    }
  },
  methods: {
    toLogin () {
      this.$auth.login()
    }
  }
}
</script>
