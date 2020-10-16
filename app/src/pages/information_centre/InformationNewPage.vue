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
    ...mapActions('information_tags', [
      'saveInformationTags',
      'saveInformationTagsTranslation'
    ]),
    saveNewInformationItemAndReturn(translationData) {
      const router = this.$router
      let id = -1
      const eventData = {
      }
      if ('category' in translationData[0]) {
        eventData.category = translationData[0].category.id
      }
      this.saveNewInformationItem(eventData)
        .then((newData) => {
          id = newData.id
          const tagArrayLength = translationData[0].tags.length
          const tagData = []
          for (let k = 0; k < tagArrayLength; k += 1) {
            tagData.push({
              informationId: newData.id
            })
          }
          this.setTopics({ id, topics: translationData[0].topics })
            .then(() => this.setUserTypes({ id, userTypes: translationData[0].userTypes }))
            .then(() => this.saveInformationTags(tagData))
            .then((newTags) => {
              for (let i = 0; i < translationData.length; i += 1) {
                const translation = translationData[i]
                const tagInfo = translation.tags
                delete translation.tags
                const dataWithId = Object.assign(translation, { id })
                delete translation.category
                delete translation.topics
                delete translation.userTypes
                const newTagsWithTag = newTags.map((newTag, idx) => ({
                  id: newTag.id,
                  lang: translation.lang,
                  tag: tagInfo[idx],
                  translationState: 0
                }))
                this.saveInformationTagsTranslation(newTagsWithTag).then()
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
