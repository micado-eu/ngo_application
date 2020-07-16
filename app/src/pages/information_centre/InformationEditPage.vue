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
      elem: undefined
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
      "addNewInformationItemTranslation",
      "unpublishItem"
    ]),
    editInformationItemAndReturn(data) {
      let router = this.$router;
      let id = parseInt(this.$route.params.id)
      let dataWithId = Object.assign(data, {
        id
      });
      let promises = []
      let idx = this.elem.translations.findIndex(t => t.lang === data.lang);
      if (idx !== -1) {
        promises.push(this.editInformationItem(dataWithId))
      } else {
        promises.push(this.addNewInformationItemTranslation(dataWithId))
      }
      promises.push(this.unpublishItem({ id }))
      Promise.all(promises).then(() => {
        router.push({ path: "/information" });
      });
    }
  },
  computed: {
    ...mapGetters("information", ["informationElemById"]),
    tags: function () {
      let elem = this.informationElemById(this.$route.params.id);
      if (elem && elem.tags) {
        return elem.tags;
      } else {
        return [];
      }
    }
  },
  created() {
    this.loading = true;
    this.fetchInformation().then(() => {
      this.elem = this.informationElemById(this.$route.params.id);
      this.loading = false;
    });
  }
};
</script>

<style></style>
