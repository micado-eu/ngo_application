<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="informationElems"
      new_url="information/new"
      :edit_url_fn="getEditRoute"
      :delete_fn="deleteItem"
      icon_name="document"
      add_label="button.add_information"
      import_label="button.import_information"
      :import_fn="importInfo"
      :export_fn="exportData"
      header_img="img:statics/Ebene_2.svg"
      title="information_centre.list_title"
      categories_enabled
      categories_url="/information/categories"
      topics_enabled
      user_types_enabled
      entity="information"
      @batchUpload="updateContent()"
      :on_publish="onPublish"
      :on_unpublish="onUnpublish"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListSearchTags from 'components/ListSearchTags'

export default {
  data() {
    return {
      loading: true,
      informationElems: []
    }
  },
  components: {
    'list-search-tags': ListSearchTags
  },
  computed: {
    ...mapGetters('information', ['information', 'informationElemById']),
    ...mapGetters('information_category', ['informationCategories'])
  },
  methods: {
    ...mapActions('topic', ['fetchTopic']),
    ...mapActions('user_type', ['fetchUserType']),
    ...mapActions('information', [
      'fetchInformation',
      'deleteInformationItem',
      'fetchAllInformationTopics',
      'fetchAllInformationUserTypes',
      'saveInformationTranslationProd',
      'editInformationItemTranslation',
      'updatePublished',
      'deleteProdTranslations',
      'importData',
      'exportData'
    ]),
    ...mapActions('information_category', ['fetchInformationCategory']),
    getEditRoute(id) {
      return `information/${id}/edit`
    },
    deleteItem(item) {
      this.deleteInformationItem(item)
        .then(() => {
          this.updateContent()
          // this.$router.go()
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while deleting information: ${err}`
          })
        })
    },
    importInfo(file) {
      this.importData(file).then(() => 
          this.updateContent()
      ).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while importing information: ${err}`
          })
        })
    },
    onPublish(id) {
      return Promise.all([
        this.saveInformationTranslationProd(id).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving information production translation: ${err}`
          })
        }),
        this.updatePublished({ id, published: true }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while updating published state: ${err}`
          })
        })
      ])
    },
    onUnpublish(id) {
      let infoElem = this.informationElemById(id)
      let promises = []
      const translation = Object.assign({}, infoElem.translations.filter(t => !t.translated)[0])
      promises.push(
        this.editInformationItemTranslation(translation).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while saving information translation: ${err}`
          })
        })
      )
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
    updateContent() {
      this.loading = true
      let promises = [this.fetchInformation(), this.fetchTopic(), this.fetchUserType(), this.fetchInformationCategory()]
      Promise.all(promises)
        .then(() => this.fetchAllInformationTopics())
        .then((information_topics) => {
          this.fetchAllInformationUserTypes().then((information_uts) => {
            this.informationElems = JSON.parse(JSON.stringify(this.information))
            const informationCategoryElems = [...this.informationCategories]
            if (this.informationElems.length > 0) {
              for (let i = 0; i < this.informationElems.length; i += 1) {
                const elem = this.informationElems[i]
                // Set categories-elements relations
                const idxCat = elem.category
                const idxCategoryObject = informationCategoryElems.findIndex(
                  (ic) => ic.id === idxCat
                )
                elem.category = informationCategoryElems[idxCategoryObject]
                elem.topics = information_topics.filter((topic) => topic.idInformation === elem.id)
                elem.userTypes = information_uts.filter((userType) => userType.idInformation === elem.id)
                if (i >= this.informationElems.length - 1) {
                  this.loading = false
                }
              }
            } else {
              this.loading = false
            }
          }).catch((err) => {
            this.$q.notify({
              type: 'negative',
              message: `Error while deleting fetching information: ${err}`
            })
          })
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: `Error while fetching information: ${err}`
          })
        })
    }
  },
  created() {
    this.updateContent()
  }
}
</script>

<style></style>
