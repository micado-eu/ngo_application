<template>
  <edit-information
    pagetitle="information_centre.add_new"
    v-on:save="saveNewInformationItemAndReturn($event)"
  />
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: {
    "edit-information": require("components/information_centre/EditInformationElement.vue")
      .default
  },
  methods: {
    ...mapActions("information", [
      "saveNewInformationItem",
      "addNewInformationItemTranslation",
      "deleteInformationItem"
    ]),
    ...mapActions("information_tags", [
      "saveInformationTags",
      "saveInformationTagsTranslation"
    ]),
    saveNewInformationItemAndReturn(translationData) {
      let router = this.$router;
      let id = -1;
      let eventData = {
        published: true,
        publicationDate: new Date().toISOString(),
        category: translationData.category.id
      };
      let tagData = {};
      let tags = translationData.tags.map(tag => {
        return {
          lang: translationData.lang,
          tag
        };
      });
      delete translationData.category;
      delete translationData.tags;
      this.saveNewInformationItem(eventData)
        .then(newData => {
          id = newData.id;
          let dataWithId = Object.assign(translationData, { id });
          tagData = {
            eventId: newData.id,
            tags
          };
          return this.addNewInformationItemTranslation(dataWithId);
        })
        .then(() => {
          return this.saveInformationTags(tagData);
        })
        .then(() => {
          router.push({ path: "/information" });
        })
        .catch((e) => {
          console.error(e);
          if (id !== -1) {
            this.deleteInformationItem({ id });
          }
        });
    }
  }
};
</script>

<style></style>
