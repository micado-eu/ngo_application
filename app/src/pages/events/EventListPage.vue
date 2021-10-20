<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="eventElems"
      new_url="events/new"
      :edit_url_fn="getEditRoute"
      :delete_fn="deleteItem"
      icon_name="document"
      add_label="button.add_event"
      title="events.list_title"
      categories_enabled
      categories_url="/events/categories"
      topics_enabled
      user_types_enabled
      is_event
      entity="event"
      @batchUpload="updateContent()"
      :on_publish="onPublish"
      :on_unpublish="onUnpublish"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListSearchTags from 'components/ListSearchTags'

export default {
  data () {
    return {
      loading: true,
      eventElems: []
    }
  },
  components: {
    'list-search-tags': ListSearchTags
  },
  computed: {
    ...mapGetters('event', ['event', 'eventElemById']),
    ...mapGetters('event_category', ['eventCategories'])
  },
  methods: {
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    ...mapActions('event', [
      'fetchEvent',
      'deleteEventItem',
      'fetchAllEventTopics',
      'fetchAllEventUserTypes',
      'saveEventTranslationProd',
      'updatePublished',
      'editEventItemTranslation',
      'deleteProdTranslations'
    ]),
    ...mapActions('event_category', ['fetchEventCategory']),
    getEditRoute (id) {
      return `events/${id}/edit`
    },
    deleteItem (item) {
      this.deleteEventItem(item)
        .then(() => {
          this.updateContent()
          // this.$router.go()
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while deleting event: ${err}`
          })
        })
    },
    updateContent () {
      this.loading = true
      let promises = [this.fetchTopic(), this.fetchUserType(), this.fetchEvent(), this.fetchEventCategory()]
      Promise.all(promises)
        .then(() => this.fetchAllEventTopics())
        .then((event_topics) => {
          this.fetchAllEventUserTypes().then((events_uts) => {
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
                elem.topics = event_topics.filter((topic) => topic.idEvent === elem.id)
                elem.userTypes = events_uts.filter((userType) => userType.idEvent === elem.id)
                if (i >= this.eventElems.length - 1) {
                  this.loading = false
                }
              }
            } else {
              this.loading = false
            }
          }).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while fetching events: ${err}`
            })
          })
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while fetching events: ${err}`
          })
        })
    },
    onPublish(id) {
      return Promise.all([
        this.saveEventTranslationProd(id).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving event production translation: ${err}`
          })
        }),
        this.updatePublished({ id, published: true }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while updating published state: ${err}`
          })
        })
      ])
    },
    onUnpublish(id) {
      let eventElem = this.eventElemById(id)
      let promises = []
      const translation = Object.assign({}, eventElem.translations.filter(t => !t.translated)[0])
      translation.translationState = 0
      promises.push(
        this.editEventItemTranslation(translation).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving event translation: ${err}`
          })
        })
      )
      promises.push(
        this.deleteProdTranslations(id).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while deleting event production translations: ${err}`
          })
        }),
        this.updatePublished({ id, published: false }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while updating published state: ${err}`
          })
        })
      )
      return Promise.all(promises)
    }
  },
  created () {
    this.updateContent()
  }
}
</script>

<style></style>
