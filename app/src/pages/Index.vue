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
  methods: {
    toLogin () {
      this.$auth.login()
    }
  }
}
</script>
