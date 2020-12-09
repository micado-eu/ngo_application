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
    ...mapGetters('event', ['event', 'eventElemById']),
    ...mapGetters('event_category', ['eventCategories'])
  },
  methods: {
    ...mapActions('event', [
      'fetchEvent',
      'deleteEventItem',
      'fetchEventTopics',
      'fetchEventUserTypes',
      'updatePublished',
      'deleteProdTranslations',
      'addNewEventItemTranslationProd'
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
      let eventElem = this.eventElemById(id)
      if (eventElem.translations[0].translationState === 4 && eventElem.published && !published) {
        // If published goes from true to false, all the content gets deleted from the translation prod table
        this.deleteProdTranslations().then(() => {
          console.log("Deleted prod translations")
        })
      } else if (eventElem.translations[0].translationState === 4 && !eventElem.published && published) {
        // If published goes from false to true, all the content with the state "translated" must be copied into the prod table
        for (let i = 0; i < eventElem.translations.length; i += 1) {
          const translation = Object.assign({}, eventElem.translations[i])
          delete translation.translationState
          delete translation.published
          this.addNewInformationItemTranslationProd(translation).then(() => { })
        }
      }
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
