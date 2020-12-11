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
    saveNewEventItemAndReturn(translationData) {
      const router = this.$router
      let id = -1
      const eventData = {
        startDate: translationData[0].startDate,
        endDate: translationData[0].finishDate,
        published: translationData[0].published
      }
      if ('category' in translationData[0]) {
        eventData.category = translationData[0].category.id
      }
      this.saveNewEventItem(eventData)
        .then((newData) => {
          id = newData.id
          this.setTopics({ id, topics: translationData[0].topics })
            .then(() => this.setUserTypes({ id, userTypes: translationData[0].userTypes }))
            .then(() => {
              for (let i = 0; i < translationData.length; i += 1) {
                const translation = translationData[i]
                const dataWithId = Object.assign(translation, { id })
                delete translation.published
                delete translation.category
                delete translation.topics
                delete translation.userTypes
                delete translation.startDate
                delete translation.finishDate
                this.addNewEventItemTranslation(dataWithId)
                  .then(() => {
                    if (i === translationData.length - 1) {
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
                message: `Error saving event: ${err}`
              })
            })
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving event: ${err}`
          })
        })
    }
  }
}
</script>

<style></style>
