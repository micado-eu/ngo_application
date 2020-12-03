<template>
  <edit-information
    pagetitle="information_centre.add_new"
    v-on:save="saveNewInformationItemAndReturn($event)"
  />
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    'edit-information': require('components/information_centre/EditInformationElement.vue')
      .default
  },
  methods: {
    ...mapActions('information', [
      'saveNewInformationItem',
      'addNewInformationItemTranslation',
      'deleteInformationItem',
      'setTopics',
      'setUserTypes'
    ]),
    saveNewInformationItemAndReturn(translationData) {
      const router = this.$router
      let id = -1
      const eventData = {
        published: translationData[0].published
      }
      if ('category' in translationData[0]) {
        eventData.category = translationData[0].category.id
      }
      this.saveNewInformationItem(eventData)
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
                this.addNewInformationItemTranslation(dataWithId)
                  .then(() => {
                    if (i === translationData.length - 1) {
                      router.push({ path: '/information' })
                    }
                  })
              }
            })
        }).catch((e) => {
          console.error(e)
          if (id !== -1) {
            this.deleteInformationItem({ id })
          }
        })
    }
  }
}
</script>

<style></style>
