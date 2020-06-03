<template>
  <edit-information
    class="q-ma-md"
    pagetitle="Add New Event to the Information Centre"
    v-on:save="saveNewInformationItemAndReturn($event)"
  />
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
      Object.assign(data, { publish: true })
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