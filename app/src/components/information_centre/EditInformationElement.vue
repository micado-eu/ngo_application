<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-element
      v-if="!loading"
      :elem="elem"
      :save_item_fn="saveInformationItem"
      :pagetitle="pagetitle"
      :categories="informationCategories"
      categories_enabled
      topics_enabled
      :topics="topics"
      user_types_enabled
      :user_types="user_types"
      :title_max_length="255"
    />
  </div>
</template>

<script>
import EditElement from 'components/EditElement'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EditInformationElement',
  components: {
    'edit-element': EditElement
  },
  data() {
    return {
      loading: true
    }
  },
  props: {
    elem: {
      type: Object
    },
    pagetitle: {
      type: String
    },
    topics: {
      type: Array
    },
    user_types: {
      type: Array
    }
  },
  methods: {
    ...mapActions('information_category', ['fetchInformationCategory']),
    saveInformationItem(translations) {
      this.$emit('save', translations)
    }
  },
  computed: {
    ...mapGetters('information_category', ['informationCategories'])
  },
  created() {
    this.loading = true
    this.fetchInformationCategory().then(() => {
      this.loading = false
    }).catch((err) => {
      this.$q.notify({
        type: 'negative',
        message: `Error while fetching information categories: ${err}`
      })
    })
  }
}
</script>

<style lang="scss" scoped></style>
