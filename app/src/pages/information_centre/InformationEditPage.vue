<template>
  <div>
    <span v-if="loading">Loading...</span>
    <edit-information
      v-if="!loading"
      v-on:save="editInformationItemAndReturn($event)"
      :tags="tags"
      :elem="elem"
      class="q-ma-md"
      pagetitle="Edit Event from the Information Centre"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: false,
      elem: undefined,
      tags: undefined
    };
  },
  components: {
    "edit-information": require("components/information_centre/EditInformationElement.vue")
      .default
  },
  methods: {
    ...mapActions("information", [
      "fetchInformation",
      "editInformationItem",
      "editInformationItemTranslation",
      "addNewInformationItemTranslation"
    ]),
    ...mapActions("information_tags", [
      "fetchInformationTags",
      "deleteInformationTagsFromEvent",
      "saveInformationTags"
    ]),
    editInformationItemAndReturn(data) {
      let router = this.$router;
      let categoryId = data.category.id;
      let id = parseInt(this.$route.params.id);
      let eventData = {
        id,
        category: categoryId
      };
      delete data.category;
      let tags = data.tags.map(tag_lbl => {
        return {
          lang: data.lang,
          tag: tag_lbl
        };
      });
      delete data.tags;
      let dataWithId = Object.assign(data, {
        id
      });
      this.editInformationItem(eventData).then(() => {
        let idx = this.elem.translations.findIndex(t => t.lang === data.lang);
        if (idx !== -1) {
          this.editInformationItemTranslation(dataWithId).then(() => {
            this.deleteInformationTagsFromEvent(id).then(() => {
              if (tags.length > 0) {
                this.saveInformationTags({
                  eventId: id,
                  tags
                }).then(() => {
                  router.push({ path: "/information" });
                });
              } else {
                router.push({ path: "/information" });
              }
            });
          });
        } else {
          this.addNewInformationItemTranslation(dataWithId).then(() => {
            if (tags.length > 0) {
              this.saveInformationTags({
                eventId: id,
                tags
              }).then(() => {
                router.push({ path: "/information" });
              });
            } else {
              router.push({ path: "/information" });
            }
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters("information", ["informationElemById"]),
    ...mapGetters("information_tags", ["informationTagsByEvent"])
  },
  created() {
    this.loading = true;
    this.fetchInformation().then(() => {
      this.elem = this.informationElemById(this.$route.params.id);
      this.fetchInformationTags().then(() => {
        this.tags = this.informationTagsByEvent(this.elem.id);
        this.loading = false;
      });
    });
  }
};
</script>

<style></style>
