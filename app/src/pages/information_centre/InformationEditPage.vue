<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-information
      v-if="!loading"
      v-on:save="editInformationItemAndReturn($event)"
      :elem="elem"
      :topics="topics"
      :user_types="userTypes"
      :on_publish="onPublish"
      :on_unpublish="onUnpublish"
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
      'addNewInformationItemTranslationProd',
      'updatePublished'
    ]),
    onPublish(id) {
      let infoElem = this.informationElemById(id)
      let promises = []
      for (let i = 0; i < infoElem.translations.length; i += 1) {
        const translation = Object.assign({}, infoElem.translations[i])
        delete translation.translationState
        delete translation.published
        promises.push(
          this.addNewInformationItemTranslationProd(translation).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving information production translation ${translation.lang}: ${err}`
            })
          })
        )
      }
      promises.push(
        this.updatePublished({ id, published: true }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while updating published state: ${err}`
          })
        })
      )
      return Promise.all(promises)
    },
    onUnpublish(id) {
      let infoElem = this.informationElemById(id)
      let promises = []
      for (let i = 0; i < infoElem.translations.length; i += 1) {
        const translation = Object.assign({}, infoElem.translations[i])
        translation.translationState = 0
        promises.push(
          this.editInformationItemTranslation(translation).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving event translation ${dataWithId.lang}: ${err}`
            })
          })
        )
      }
      promises.push(
        this.deleteProdTranslations(id).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while deleting information production translations: ${err}`
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
    },
    editInformationItemAndReturn(data) {
      const router = this.$router
      const categoryId = data[0].category.id
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId,
        published: data[0].published
      }
      this.editInformationItem(eventData).then(() => {
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
          delete translation.creator
          this.editInformationItemTranslation(dataWithId).then(() => {
            if (i === data.length - 1) {
              router.push({ path: '/information' })
            }
          }).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while saving the information translation ${dataWithId.lang}: ${err}`
            })
          })
        }
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while saving the information: ${err}`
        })
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
      }).catch((err) => {
        this.$q.notify({
          type: 'negative',
          message: `Error while fetching information: ${err}`
        })
      })
  }
}
</script>

<style></style>
