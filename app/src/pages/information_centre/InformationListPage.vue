<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="informationElems"
      new_url="information/new"
      :edit_url_fn="getEditRoute"
      :delete_fn="deleteItem"
      :publish_fn="updatePublishedInformation"
      icon_name="document"
      add_label="button.add_information"
      title="information_centre.list_title"
      categories_enabled
      categories_url="/information/categories"
      topics_enabled
      user_types_enabled
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
      'updatePublished',
      'deleteProdTranslations',
      'addNewInformationItemTranslationProd'
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
        })
    },
    updatePublishedInformation(published, id) {
      let infoElem = this.informationElemById(id)
      if (infoElem.translations[0].translationState === 4 && infoElem.published && !published) {
        // If published goes from true to false, all the content gets deleted from the translation prod table
        this.deleteProdTranslations().then(() => {
          console.log("Deleted prod translations")
        })
      } else if (infoElem.translations[0].translationState === 4 && !infoElem.published && published) {
        // If published goes from false to true, all the content with the state "translated" must be copied into the prod table
        for (let i = 0; i < infoElem.translations.length; i += 1) {
          const translation = Object.assign({}, infoElem.translations[i])
          delete translation.translationState
          delete translation.published
          this.addNewInformationItemTranslationProd(translation).then(() => { })
        }
      }
      this.updatePublished({ id, published }).then(() => {
        //console.log("new published value for " + id + ": " + published)
      })
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
