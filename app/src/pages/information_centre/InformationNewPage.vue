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
      "addNewInformationItemTranslation",
      "deleteInformationItem"
    ]),
    saveNewInformationItemAndReturn(translationData) {
      let router = this.$router;
      let id = -1;
      let eventData = {
        publicationDate: new Date().toISOString()
      };
      this.saveNewInformationItem(eventData)
        .then(newData => {
          id = newData.id;
          let dataWithId = Object.assign(translationData, { id });
          return this.addNewInformationItemTranslation(dataWithId);
        })
        .then(() => {
          router.push({ path: "/information" });
        })
        .catch(() => {
          if (id !== -1) {
            this.deleteGlossaryItem({ id });
          }
        });
    }
  }
};
</script>

<style></style>
