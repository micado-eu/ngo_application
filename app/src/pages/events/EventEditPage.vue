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
      'setUserTypes'
    ]),
    ...mapActions('event_tags', [
      'fetchEventTags',
      'deleteEventTagsFromEvent',
      'saveEventTags',
      'saveEventTagsTranslation'
    ]),
    editEventItemAndReturn(data) {
      const router = this.$router
      const categoryId = data[0].category.id
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId,
        startDate: data[0].startDate,
        endDate: data[0].finishDate
      }
      const tagArrayLength = data[0].tags.length
      const tagData = []
      for (let k = 0; k < tagArrayLength; k += 1) {
        tagData.push({
          eventId: id
        })
      }
      this.deleteEventTagsFromEvent(id)
        .then(() => this.saveEventTags(tagData))
        .then((newTags) => {
          this.editEventItem(eventData).then(() => {
            const { topics } = data[0]
            this.deleteTopics(id)
              .then(() => this.setTopics({ id, topics }))
              .then(() => { })
            const { userTypes } = data[0]
            this.deleteUserTypes(id)
              .then(() => this.setUserTypes({ id, userTypes }))
              .then(() => { })
            for (let i = 0; i < data.length; i += 1) {
              const translation = data[i]
              const tagInfo = translation.tags
              delete translation.tags
              const dataWithId = Object.assign(translation, { id })
              delete translation.category
              delete translation.topics
              delete translation.userTypes
              delete translation.startDate
              delete translation.finishDate
              const newTagsWithTag = newTags.map((newTag, idx) => ({
                id: newTag.id,
                lang: translation.lang,
                tag: tagInfo[idx],
                translationState: 0
              }))
              this.saveEventTagsTranslation(newTagsWithTag).then()
              this.editEventItemTranslation(dataWithId).then(() => {
                if (i === data.length - 1) {
                  router.push({ path: '/events' })
                }
              })
            }
          })
        })
    }
  },
  computed: {
    ...mapGetters('event', ['eventElemById']),
    ...mapGetters('event_tags', ['eventTagsByEvent'])
  },
  created() {
    this.loading = true
    this.fetchEvent()
      .then(() => {
        this.elem = this.eventElemById(this.$route.params.id)
        return this.fetchEventTags()
      })
      .then(() => {
        this.tags = this.eventTagsByEvent(this.elem.id)
        return this.fetchEventTopics(this.elem.id)
      })
      .then((eventTopics) => {
        this.topics = eventTopics.map((it) => it.idTopic)
        return this.fetchEventUserTypes(this.elem.id)
      })
      .then((eventUserTypes) => {
        this.userTypes = eventUserTypes.map((iut) => iut.idUserTypes)
        this.loading = false
      })
  }
}
</script>

<style></style>
