<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="eventElems"
      new_url="events/new"
      :edit_url_fn="getEditRoute"
      :delete_fn="deleteItem"
      :publish_fn="updatePublishedEvents"
      icon_name="document"
      add_label="button.add_event"
      title="events.list_title"
      categories_enabled
      categories_url="/events/categories"
      topics_enabled
      user_types_enabled
      is_event
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListSearchTags from 'components/ListSearchTags'

export default {
  data() {
    return {
      loading: true,
      eventElems: []
    }
  },
  components: {
    'list-search-tags': ListSearchTags
  },
  computed: {
    ...mapGetters('event', ['event']),
    ...mapGetters('event_category', ['eventCategories'])
  },
  methods: {
    ...mapActions('event', [
      'fetchEvent',
      'deleteEventItem',
      'fetchEventTopics',
      'fetchEventUserTypes',
      'updatePublished'
    ]),
    ...mapActions('event_category', ['fetchEventCategory']),
    getEditRoute(id) {
      return `events/${id}/edit`
    },
    deleteItem(item) {
      this.deleteEventItem(item)
        .then(() => {
          this.updateContent()
          // this.$router.go()
        })
    },
    updatePublishedEvents(published, id) {
      this.updatePublished({ id, published }).then(() => {
        //console.log("new published value for " + id + ": " + published)
      })
    },
    updateContent() {
      this.loading = true
      this.fetchEvent().then(() => {
        this.fetchEventCategory().then(() => {
          this.eventElems = JSON.parse(JSON.stringify(this.event))
          const eventCategoryElems = [...this.eventCategories]
          if (this.eventElems.length > 0) {
            for (let i = 0; i < this.eventElems.length; i += 1) {
              const elem = this.eventElems[i]
              // Set categories-elements relations
              const idxCat = elem.category
              const idxCategoryObject = eventCategoryElems.findIndex(
                (ic) => ic.id === idxCat
              )
              elem.category = eventCategoryElems[idxCategoryObject]

              this.fetchEventTopics(elem.id).then((topics) => {
                elem.topics = topics.filter((topic) => topic.idEvent === elem.id)
                return this.fetchEventUserTypes(elem.id)
              }).then((userTypes) => {
                elem.userTypes = userTypes.filter((userType) => userType.idEvent === elem.id)
                if (i >= this.eventElems.length - 1) {
                  this.loading = false
                }
              })
            }
          } else {
            this.loading = false
          }
        })
      })
    }
  },
  created() {
    this.updateContent()
  }
}
</script>

<style></style>
