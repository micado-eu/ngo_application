<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-information
      v-if="!loading"
      v-on:save="editInformationItemAndReturn($event)"
      :title="title"
      :description="description"
      :tags="tags"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      loading: false,
      informationElem: undefined
    }
  },
  components: {
    "edit-information": require('components/information_centre/EditInformationElement.vue').default,
  },
  methods: {
    ...mapActions("information", ["fetchInformation", "editInformationItem"]),
    editInformationItemAndReturn(data) {
      let router = this.$router
      this.editInformationItem(Object.assign(data, { id: this.$route.params.id, publish: this.informationElemById(this.$route.params.id).publish })).then(() => {
        router.push({ path: "/information" })
      })
    }
  },
  computed: {
    ...mapGetters("information", ["informationElemById"]),
    title: function () {
      let elem = this.informationElemById(this.$route.params.id)
      if (elem) {
        return elem.title
      } else {
        return ""
      }
    },
    description: function () {
      let elem = this.informationElemById(this.$route.params.id)
      if (elem) {
        return elem.description
      } else {
        return ""
      }
    },
    tags: function () {
      let elem = this.informationElemById(this.$route.params.id)
      if (elem) {
        return elem.tags
      } else {
        return []
      }
    },
  },
  created() {
    this.loading = true
    this.fetchInformation().then(() => {
      this.loading = false
    })
  }
}
</script>

<style>
</style>