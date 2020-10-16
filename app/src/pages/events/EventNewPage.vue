<template>
  <edit-event
    pagetitle="events.add_new"
    v-on:save="saveNewEventItemAndReturn($event)"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    'edit-event': require('components/events/EditEventElement.vue')
      .default
  },
  methods: {
    ...mapActions('event', [
      'saveNewEventItem',
      'addNewEventItemTranslation',
      'deleteEventItem',
      'setTopics',
      'setUserTypes'
    ]),
    ...mapActions('event_tags', [
      'saveEventTags',
      'saveEventTagsTranslation'
    ]),
    saveNewEventItemAndReturn(translationData) {
      const router = this.$router
      let id = -1
      const eventData = {
        startDate: translationData[0].startDate,
        endDate: translationData[0].finishDate
      }
      if ('category' in translationData[0]) {
        eventData.category = translationData[0].category.id
      }
      this.saveNewEventItem(eventData)
        .then((newData) => {
          id = newData.id
          const tagArrayLength = translationData[0].tags.length
          const tagData = []
          for (let k = 0; k < tagArrayLength; k += 1) {
            tagData.push({
              eventId: newData.id
            })
          }
          this.setTopics({ id, topics: translationData[0].topics })
            .then(() => this.setUserTypes({ id, userTypes: translationData[0].userTypes }))
            .then(() => this.saveEventTags(tagData))
            .then((newTags) => {
              for (let i = 0; i < translationData.length; i += 1) {
                const translation = translationData[i]
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
                this.addNewEventItemTranslation(dataWithId)
                  .then(() => {
                    if (i === translationData.length - 1) {
                      router.push({ path: '/events' })
                    }
                  })
              }
            })
        }).catch((e) => {
          console.error(e)
          if (id !== -1) {
            this.deleteEventItem({ id })
          }
        })
    }
  }
}
</script>

<style></style>
