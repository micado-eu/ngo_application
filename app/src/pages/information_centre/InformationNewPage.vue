<template>
  <edit-information
    class="q-ma-md"
    pagetitle="Add New Event to the Information Centre"
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
      "addNewInformationItemTranslation"
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
          let tagData = {
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
    }
  }
};
</script>

<style></style>
