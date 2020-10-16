<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-element
      v-if="!loading"
      :elem="elem"
      :save_item_fn="saveEventItem"
      :tags="tags"
      :pagetitle="pagetitle"
      tags_enabled
      :categories="eventCategories"
      categories_enabled
      topics_enabled
      :topics="topics"
      user_types_enabled
      :user_types="user_types"
      is_event
    />
  </div>
</template>

<script>
import EditElement from 'components/EditElement'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EditEventElement',
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
    tags: {
      type: Array
    },
    topics: {
      type: Array
    },
    user_types: {
      type: Array
    }
  },
  methods: {
    ...mapActions('event_category', ['fetchEventCategory']),
    saveEventItem(translations) {
      this.$emit('save', translations)
    }
  },
  computed: {
    ...mapGetters('event_category', ['eventCategories'])
  },
  created() {
    this.loading = true
    this.fetchEventCategory().then(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped></style>
