<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-information
      v-if="!loading"
      v-on:save="editInformationItemAndReturn($event)"
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
      'fetchInformationUserTypes',
      'deleteProdTranslations',
      'addNewInformationItemTranslationProd'
    ]),
    editInformationItemAndReturn(data) {
      const router = this.$router
      const categoryId = data[0].category.id
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId,
        published: data[0].published
      }
      if (this.elem.published && data[0].translationState === 0) {
        this.deleteProdTranslations().then(() => {
          console.log("Deleted prod translations")
        })
      }
      if (this.elem.published && !eventData.published) {
        // If published goes from true to false, all the content gets deleted from the translation prod table
        this.deleteProdTranslations().then(() => {
          console.log("Deleted prod translations")
        })
      }
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
          const dataWithId = Object.assign(translation, { id })
          delete translation.published
          delete translation.category
          delete translation.topics
          delete translation.userTypes
          this.editInformationItemTranslation(dataWithId).then(() => {
            if (!this.elem.published && eventData.published && dataWithId.translationState === 4) {
              // If published goes from false to true, all the content with the state "translated" must be copied into the prod table
              delete dataWithId.translationState
              delete dataWithId.published
              this.addNewInformationItemTranslationProd(dataWithId).then(() => { })
            }
            if (i === data.length - 1) {
              router.push({ path: '/information' })
            }
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters('information', ['informationElemById'])
  },
  created() {
    this.loading = true
    this.fetchInformation()
      .then(() => {
        this.elem = this.informationElemById(this.$route.params.id)
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
