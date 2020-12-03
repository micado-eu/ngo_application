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
    ...mapGetters('information', ['information']),
    ...mapGetters('information_category', ['informationCategories'])
  },
  methods: {
    ...mapActions('information', [
      'fetchInformation',
      'deleteInformationItem',
      'fetchInformationTopics',
      'fetchInformationUserTypes',
      'updatePublished'
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
      this.updatePublished({ id, published }).then(() => {
        //console.log("new published value for " + id + ": " + published)
      })
    },
    updateContent() {
      this.loading = true
      this.fetchInformation().then(() => {
        this.fetchInformationCategory().then(() => {
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

              this.fetchInformationTopics(elem.id).then((topics) => {
                elem.topics = topics.filter((topic) => topic.idInformation === elem.id)
                return this.fetchInformationUserTypes(elem.id)
              }).then((userTypes) => {
                elem.userTypes = userTypes.filter(
                  (userType) => userType.idInformation === elem.id
                )
                if (i >= this.informationElems.length - 1) {
                  this.loading = false
                }
              })
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
