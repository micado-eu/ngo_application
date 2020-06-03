<template>
  <div>
    <edit-element
      :title="title"
      :description="description"
      :save_item_fn="saveInformationItem"
      :tags="tags"
      :pagetitle="pagetitle"
    />
  </div>
</template>

<script>
import EditElement from 'components/EditElement'
export default {
  name: "EditInformationElement",
  components: {
    "edit-element": EditElement
  },
  props: {
    "title": {
      type: String,
    },
    "description": {
      type: String | Object,
    },
    "tags": {
      type: Array
    },
    "pagetitle": {
      type: String
    }
  },
  methods: {
    saveInformationItem(title, desc, tags) {
      this.$emit('save', { title: title, description: desc, tags: tags })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>