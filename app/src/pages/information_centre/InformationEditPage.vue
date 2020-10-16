<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-information
      v-if="!loading"
      v-on:save="editInformationItemAndReturn($event)"
      :tags="tags"
      :elem="elem"
      :topics="topics"
      :user_types="userTypes"
      class="q-ma-md"
      pagetitle="information_centre.edit"
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
    'edit-information': require('components/information_centre/EditInformationElement.vue')
      .default
  },
  methods: {
    ...mapActions('information', [
      'fetchInformation',
      'editInformationItem',
      'editInformationItemTranslation',
      'setTopics',
      'setUserTypes',
      'deleteTopics',
      'deleteUserTypes',
      'fetchInformationTopics',
      'fetchInformationUserTypes'
    ]),
    ...mapActions('information_tags', [
      'fetchInformationTags',
      'deleteInformationTagsFromInformation',
      'saveInformationTags',
      'saveInformationTagsTranslation'
    ]),
    editInformationItemAndReturn(data) {
      const router = this.$router
      const categoryId = data[0].category.id
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId
      }
      const tagArrayLength = data[0].tags.length
      const tagData = []
      for (let k = 0; k < tagArrayLength; k += 1) {
        tagData.push({
          informationId: id
        })
      }
      this.deleteInformationTagsFromInformation(id)
        .then(() => this.saveInformationTags(tagData))
        .then((newTags) => {
          this.editInformationItem(eventData).then(() => {
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
              const newTagsWithTag = newTags.map((newTag, idx) => ({
                id: newTag.id,
                lang: translation.lang,
                tag: tagInfo[idx],
                translationState: 0
              }))
              this.saveInformationTagsTranslation(newTagsWithTag).then()
              this.editInformationItemTranslation(dataWithId).then(() => {
                if (i === data.length - 1) {
                  router.push({ path: '/information' })
                }
              })
            }
          })
        })
    }
  },
  computed: {
    ...mapGetters('information', ['informationElemById']),
    ...mapGetters('information_tags', ['informationTagsByInformation'])
  },
  created() {
    this.loading = true
    this.fetchInformation()
      .then(() => {
        this.elem = this.informationElemById(this.$route.params.id)
        return this.fetchInformationTags()
      })
      .then(() => {
        this.tags = this.informationTagsByInformation(this.elem.id)
        return this.fetchInformationTopics(this.elem.id)
      })
      .then((informationTopics) => {
        this.topics = informationTopics.map((it) => it.idTopic)
        return this.fetchInformationUserTypes(this.elem.id)
      })
      .then((informationUserTypes) => {
        this.userTypes = informationUserTypes.map((iut) => iut.idUserTypes)
        this.loading = false
      })
  }
}
</script>

<style></style>
