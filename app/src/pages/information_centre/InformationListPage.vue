<template>
  <div>
    <span v-if="loading">Loading...</span>
    <list-search-tags
      v-if="!loading"
      :elements="informationElems"
      new_url="information/new"
      :edit_url_fn="getEditRoute"
      icon_name="document"
      add_label="Add Event"
      title="Information centre"
      categories_enabled
      tags_enabled
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ListSearchTags from "components/ListSearchTags";
export default {
  data() {
    return {
      loading: true,
      informationElems: []
    };
  },
  components: {
    "list-search-tags": ListSearchTags
  },
  computed: {
    ...mapGetters("information", ["information"]),
    ...mapGetters("information_category", ["informationCategories"]),
    ...mapGetters("information_tags", ["informationTagsByEvent"])
  },
  methods: {
    ...mapActions("information", [
      "fetchInformation",
      "updatePublishInformationItem"
    ]),
    ...mapActions("information_category", ["fetchInformationCategory"]),
    ...mapActions("information_tags", ["fetchInformationTags"]),
    ...mapActions("information_tags", ["fetchInformationTags"]),
    getEditRoute(id) {
      return "information/" + id + "/edit";
    },
  },
  created() {
    this.loading = true;
    this.fetchInformation().then(() => {
      this.fetchInformationCategory().then(() => {
        this.fetchInformationTags().then(() => {
          this.informationElems = JSON.parse(JSON.stringify(this.information));
          let informationCategoryElems = [...this.informationCategories];
          for (let category of informationCategoryElems) {
            for (let translation of category.translations) {
              translation.category = translation["eventCategory"];
              delete translation.eventCategory;
            }
          }
          for (let elem of this.informationElems) {
            // Set categories-elements relations
            let idxCat = elem.category;
            let idxCategoryObject = informationCategoryElems.findIndex(
              ic => ic.id === idxCat
            );
            elem.category = informationCategoryElems[idxCategoryObject];
            // Set tag-elements relations
            elem.tags = this.informationTagsByEvent(elem.id);
          }
          this.loading = false;
        });
      });
    });
  }
};
</script>

<style></style>
