<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-event
      v-if="!loading"
      v-on:save="editEventItemAndReturn($event)"
      :tags="tags"
      :elem="elem"
      :topics="topics"
      :user_types="userTypes"
      class="q-ma-md"
      pagetitle="events.edit"
      :on_publish="onPublish"
      :on_unpublish="onUnpublish"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      elem: undefined,
      tags: undefined,
      topics: undefined,
      userTypes: undefined
    }
  },
  components: {
    'edit-event': require('components/events/EditEventElement.vue')
      .default
  },
  methods: {
    ...mapActions('event', [
      'fetchEvent',
      'fetchEventTopics',
      'fetchEventUserTypes',
      'editEventItem',
      'editEventItemTranslation',
      'addNewEventItemTranslation',
      'deleteTopics',
      'setTopics',
      'deleteUserTypes',
      'setUserTypes',
      'deleteProdTranslations',
      'addNewEventItemTranslationProd',
      'updatePublished'
    ]),
    onPublish(id) {
      let eventElem = this.eventElemById(id)
      for (let i = 0; i < eventElem.translations.length; i += 1) {
        const translation = Object.assign({}, eventElem.translations[i])
        delete translation.translationState
        delete translation.published
        this.addNewEventItemTranslationProd(translation).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving event production translation ${translation.lang}: ${err}`
          })
        })
      }
      this.updatePublished({ id, published }).then(() => {
        //console.log("new published value for " + id + ": " + published)
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while updating published state: ${err}`
        })
      })
    },
    onUnpublish(id) {
      this.deleteProdTranslations(id).then(() => {
        console.log("Deleted prod translations")
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while deleting event production translations: ${err}`
        })
      })
      this.updatePublished({ id, published }).then(() => {
        //console.log("new published value for " + id + ": " + published)
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while updating published state: ${err}`
        })
      })
    },
    editEventItemAndReturn(data) {
      const router = this.$router
      const categoryId = data[0].category.id
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId,
        startDate: data[0].startDate,
        endDate: data[0].finishDate,
        published: data[0].published
      }
      this.editEventItem(eventData).then(() => {
        const { topics } = data[0]
        this.deleteTopics(id)
          .then(() => this.setTopics({ id, topics }))
          .catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving topics: ${err}`
            })
          })
        const { userTypes } = data[0]
        this.deleteUserTypes(id)
          .then(() => this.setUserTypes({ id, userTypes }))
          .catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving user types: ${err}`
            })
          })
        for (let i = 0; i < data.length; i += 1) {
          const translation = data[i]
          const dataWithId = Object.assign(translation, { id })
          delete translation.published
          delete translation.category
          delete translation.topics
          delete translation.userTypes
          delete translation.startDate
          delete translation.finishDate
          this.editEventItemTranslation(dataWithId).then(() => {
            if (i === data.length - 1) {
              router.push({ path: '/events' })
            }
          }).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving event translation ${dataWithId.lang}: ${err}`
            })
          })
        }
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while saving event: ${err}`
        })
      })
    }
  },
  computed: {
    ...mapGetters('event', ['eventElemById'])
  },
  created() {
    this.loading = true
    this.fetchEvent()
      .then(() => {
        this.elem = this.eventElemById(this.$route.params.id)
        return this.fetchEventTopics(this.elem.id)
      })
      .then((eventTopics) => {
        this.topics = eventTopics.map((it) => it.idTopic)
        return this.fetchEventUserTypes(this.elem.id)
      })
      .then((eventUserTypes) => {
        this.userTypes = eventUserTypes.map((iut) => iut.idUserTypes)
        this.loading = false
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while fetching event: ${err}`
        })
      })
  }
}
</script>

<style></style>
