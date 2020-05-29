<template>
  <edit-information v-on:save="saveNewInformationItemAndReturn($event)" />
</template>

<script>
import { mapActions } from "vuex"
export default {
  components: {
    "edit-information": require('components/information_centre/EditInformationElement.vue').default,
  },
  methods: {
    ...mapActions("information", ["saveNewInformationItem"]),
    saveNewInformationItemAndReturn(data) {
      let router = this.$router
      this.saveNewInformationItem(data).then(() => {
        router.push({ path: "/information" })
      })
    }
  }
}
</script>

<style>
</style>