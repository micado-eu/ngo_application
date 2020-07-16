<template>
  <div>
    <edit-element
      :elem="elem"
      :save_item_fn="saveInformationItem"
      :tags="tags"
      :pagetitle="pagetitle"
      tags_enabled
    />
  </div>
</template>

<script>
import EditElement from "components/EditElement";
export default {
  name: "EditInformationElement",
  components: {
    "edit-element": EditElement
  },
  props: {
    elem: {
      type: Object
    },
    tags: {
      type: Array
    },
    pagetitle: {
      type: String
    }
  },
  methods: {
    saveInformationItem(title, desc, lang, tags) {
      // TODO: Reenable tags
      this.$emit("save", { title: title, description: desc, lang });
    }
  }
};
</script>

<style lang="scss" scoped></style>
