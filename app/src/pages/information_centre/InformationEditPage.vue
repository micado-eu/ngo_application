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
      'deleteCategory'
    ]),
    editInformationItemAndReturn(data) {
      const router = this.$router
      let categoryId = undefined
      if (('category' in data[0]) && (data[0].category)) {
        categoryId = data[0].category.id
      }
      const id = parseInt(this.$route.params.id, 10)
      const eventData = {
        id,
        category: categoryId
      }
      if (eventData.category === undefined) {
        this.deleteCategory(id).then(() => {})
      } else {
        this.editInformationItem(eventData).then(() => {
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving the information: ${err}`
          })
        })
      }
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
