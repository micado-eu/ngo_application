<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="information"
      new_url="information/new"
      :edit_url_fn="getEditRoute"
      :delete_fn="deleteInformationItem"
      title="Information centre"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import ListSearchTags from 'components/ListSearchTags'
export default {
  data() {
    return {
      loading: true,
    }
  },
  components: {
    "list-search-tags": ListSearchTags
  },
  computed: {
    ...mapGetters("information", ["information"]),
  },
  methods: {
    ...mapActions("information", ["fetchInformation", "deleteInformationItem"]),
    getEditRoute(id) {
      return "information/" + id + "/edit"
    }
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